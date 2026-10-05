### Architecture Write-Up

When starting this assignment, I decided to structure the project using a **Feature-Based Architecture**. Instead of grouping files by functional type (e.g., putting all hooks together and all components together), I modularized the codebase into distinct vertical slices like `home`, `story-detail`, and `comic-reader`. This encapsulation prevents scattered imports and keeps the codebase maintainable as the project grows.

For state management, I integrated **Zustand**. This completely eliminated the need for deep prop-drilling across the React Navigation tree. For example, the `HomeScreen` can directly dispatch an action to open a story, and the `StoryDetailScreen` reads the `selectedStoryId` directly from the store. I also paired Zustand with `AsyncStorage` to persist the user's `zoomScale` in the Comic Reader, allowing it to survive app kills and chapter changes.

For the data layer, I analyzed the local backend's OpenAPI JSON and generated strict TypeScript interfaces for all data contracts. I connected this to **TanStack React Query**, which provided out-of-the-box caching, background refetching, and clean loading/error states, heavily simplifying the UI component logic.

The core challenge was the Comic Reader's performance and layout. To optimize it, I configured the `<FlatList>` with strict `windowSize` (5), `initialNumToRender` (2), and `maxToRenderPerBatch` (2). This ensures that only the immediately visible pages and the adjacent viewport are kept in memory, preventing massive memory spikes when scrolling through a 100-page chapter. For the layout, I dynamically calculated `renderWidth` based on the persistent `zoomScale` and handled landscape safe-area bleeds by dynamically measuring the FlatList's `onLayout` width instead of relying on `useWindowDimensions`.

### (If you used AI) A decision, if any, where you rejected the agent’s first suggestion in favour of a different approach. And why.

When implementing the pinch-zoom functionality, the AI initially suggested using comprehensive third-party libraries like `@openspacelabs/react-native-zoomable-view` and `@likashefqet/react-native-image-zoom`. I explicitly rejected these suggestions and instructed the agent to build a custom implementation instead. 

**Why:** The older pure-JS libraries relied on deprecated React Native core APIs (like `InteractionManager`), which caused immediate fatal render errors. The newer libraries relied on `react-native-reanimated` and `react-native-gesture-handler`. Adding these native modules triggered build crashes on my physical Samsung S23 dev client. By pushing back and instructing the AI to use a lightweight, purely native `PanResponder` and `Animated.Value` approach, we bypassed the native compilation crashes entirely, kept the bundle small, and achieved a stable 60 FPS zoom experience on the physical device.


### A list of edge-cases that you are handling, and those that you are not.
**Handling:**
*   **Landscape Safe-Areas:** Notch/safe area clipping on rotated landscape devices (handled by using `onLayout` to calculate actual view width instead of raw `useWindowDimensions()` to prevent cross-page bleed).
*   **Persistent Scaling:** Handling zoom persistence across chapter changes and app kills using Zustand alongside `AsyncStorage`.
*   **Zoom-Out Layout Shift:** Auto-snapping the `ScrollView` and `FlatList` offsets perfectly back to the center/origin when returning to a `1.0` zoom scale to prevent black empty rendering voids on the screen.
*   **API Connectivity:** Port forwarding to ensure local API connections work seamlessly across both AVD emulators and physical devices over USB without hardcoding local Wi-Fi IPs (via `adb reverse`).

**Not Handling:**
*   **Focal Pinch Zooming:** Deep pinch-zooming into a specific coordinate focal point (the zoom currently scales from the center).
*   **Extreme Rapid Scrolling at Max Zoom:** Handling memory exhaustion if a user zooms to max scale and scrolls extremely rapidly across 100+ pages, as the `FlatList` rendering window gets incredibly large. 

### A measurement of Scroll FPS at the max implemented zoom on a physical device (and how you measured it + which device you used)
*   **Scroll FPS:** Maintained a stable **59 to 60 FPS**.
*   **Measurement Method:** Measured using the React Native built-in Performance Monitor overlay.
*   **Devices Used:** Verified on both a **Pixel AVD Emulator** and a physical **Samsung Galaxy S23** device (screenshots of the performance metrics have been added to the codebase).

### Three decisions where you chose A over B and what would flip you to B
1.  **Pure Native `PanResponder` vs. External Zoom Libraries:** Chose a custom native `PanResponder` implementation because the external libraries either relied on deprecated core modules (like `InteractionManager`) or triggered native Android compile crashes on the S23 physical device setup. 
    *   *What would flip me to B:* If the dev environment had `react-native-reanimated` and `react-native-gesture-handler` already compiled natively into the dev client, I would use an external library built on top of Reanimated for gesture thread execution.
2.  **Zustand vs. React Context for Global State:** Chose Zustand to avoid massive prop-drilling across the app navigator (e.g. keeping track of the selected story from Home to Reader) and to prevent full-tree re-renders. 
    *   *What would flip me to B:* If the global state was strictly read-once context (like an Auth token or Theme) that rarely changed and didn't require complex asynchronous persistence.
3.  **Horizontal `ScrollView` Wrapping vs. Native `FlatList` Pan:** Chose to wrap the Single Page `FlatList` in a horizontal `ScrollView` because it allowed the width of the `FlatList` to naturally expand beyond screen bounds for seamless panning without fighting the list layout. 
    *   *What would flip me to B:* If we needed deep performance virtualization for horizontal pagination while zoomed in, I would restructure the `FlatList` to handle custom tile measurement instead of relying on a wrapper.

### The part of this codebase you're least happy with
The reader zoom functionality. It could have been approached differently, and I am least happy with how the initial implementations were handled. In hindsight, building a standalone Proof of Concept (PoC) for the zoom mechanics first—especially testing the structural differences between Single View scrolling and Book View layout snapping—before integrating it deeply into the main viewer components would have resulted in cleaner separation and fewer layout shift bugs.

### One thing you tried that didn't work
Using `useWindowDimensions().width` to define the Book View paging width in landscape mode. It didn't work because `useWindowDimensions()` includes the notch/safe-areas in its width. When the `FlatList` snapped to `pagingEnabled`, it resulted in a ~44px layout mismatch, causing a visual bleed-through where the next page would spill into the current view. This was fixed by using the `FlatList`'s internal `onLayout` width instead.