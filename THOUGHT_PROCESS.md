# FanonAppAssignment: Technical Notes

## 1. Package Manager: npm → pnpm

```bash
pnpm import                              # generate pnpm-lock.yaml from package-lock.json
rm -rf node_modules package-lock.json
pnpm install
```

## 2. Navigation Dependencies

Reference: <https://reactnavigation.org/docs/getting-started>

```bash
pnpm add @react-navigation/native
pnpm add @react-navigation/bottom-tabs
```

## 3. Architecture Decision: Feature-Based Structure

The project uses a **feature-based** architecture instead of a function-based one.

**Reason:** In a function-based layout, files related to one feature are scattered across the codebase, which gets messy as the project grows. Feature-based keeps everything for a feature together.

## 4. API Type Generation

A local backend runs at `http://localhost:3001`.

**Task:** Fetch `http://localhost:3001/openapi.json` (or inspect the endpoints below), analyze all request/response schemas, and generate clean TypeScript interfaces in `types.ts` for:

- Data contracts
- Query parameters
- Error objects

**Endpoints:**

- `/stories`
- `/stories/{id}`
- `/chapters?story={id}`
- `/chapters/{id}`

## 5. Known Error: React LogBox

```
Console Error
Internal React error: Expected static flag was missing. Please notify the React team.

Source: node_modules/react-native/Libraries/LogBox/Data/LogBoxData.js (235:38)

Call Stack:
  addLog              (LogBoxData.js:235)
  addConsoleLog       (LogBox.js:213)
  reactConsoleErrorHandler (ExceptionsManager.js:248)
```

## 6. Pagination

The app uses **cursor-based pagination**.

## 7. State Management: Zustand

- Feature-based architecture is in place; next step is **Home cleanup and separation of concerns**.
- **Zustand** is used to avoid prop drilling across screens and tabs.
- Home can call `openStory` directly from the store.

## 8. Store-Driven Navigation

| Component | Behavior |
|---|---|
| `HomeScreen.tsx` | Calls `useAppStore((s) => s.openStory)` directly. No callback prop drilling through `AppNavigator` / `AppTabs`. |
| `StoryDetailScreen.tsx` | Reads `selectedStoryId`, `closeStory`, and `openChapter` from the store. |
| `AppNavigator.tsx` | Simplified to pure tab navigation. Listens to `selectedStoryId` to transition between views. |

## 9. Collapsible Chapter List in Reader

**Requirement:** Make the chapter list page collapsible. From the reader, tapping the list icon (or back icon) should show a collapsed list of chapter pages.

## 10. Comic Reader Performance

**Problem:** The reader currently renders all pages at once.

**Plan:**

- Initially render only 2–3 pages and load the visible ones first.
- Use a windowed approach: **window size 5**, keeping only **2 viewports ahead and behind** in memory.
- Show skeleton placeholders for smooth loading (`react-native-skeleton-loading`).

## 11. Code Style: Avoid Pyramid of Doom

- Extract conditional rendering logic into separate variables.
- Handle loading and error states upfront (early returns) so the main `return` stays clean.
- Target: `ComicReaderScreen`, around line 70.

## 12. Zoom Persistence

- Page width is computed as `pageWidth = width * zoomScale`.
- Zoom scale is stored in **AsyncStorage** so it survives chapter changes and app restarts.

## 13. Loader

An SVG animation loader (`loader.svg`) has been added.

- Use it in the comic reader.
- Show it until data is properly available, **instead of** a generic spinner or skeleton.

## 14. VirtualizedList Warning

```
VirtualizedList: You have a large list that is slow to update - make sure your
renderItem function renders components that follow React performance best
practices like PureComponent, shouldComponentUpdate, etc.
{dt: 606, prevDt: 694, contentLength: 5696}
```

**Action:** Make `renderItem` components memoized/pure (e.g. `React.memo`).

## 15. Physical and Virtual Device API Setup

- **Issue:** The virtual emulator reaches the host via `10.0.2.2`, but a physical device over USB cannot.
- **Fix:** Set the API URL to `http://localhost:3001` and forward port 3001 to both devices with ADB:

  ```bash
  adb reverse tcp:3001 tcp:3001
  ```

- **Result:** Both the physical USB phone and the emulator connect directly to the local backend, with no Wi-Fi IP issues.

## 16. Reader Fast-Scroll Loader (Investigation)

**Observation:** Scrolling fast in the Reader shows a loader.

**Open questions:**

1. Is this caused by API latency or by our implementation?
2. Webtoon feels seamless even with fast scrolling. How do they handle it, and can we make our scrolling smoother?

## 17. Book View: Rotated Layout Overflow

**Symptom:** In rotated (landscape) book view, a page overflows into the next one. The right edge of the left page and the left edge of the right page do not connect like a real book spread.

**Root cause:**

```
useWindowDimensions().width = 844px    ← full screen (notch included)
SafeAreaView (left + right edges)      ← cuts ~22px per side for the notch
FlatList actual rendered width = 800px ← what pagingEnabled snaps to

Each BookViewItem rendered at 844px wide, but the FlatList paged every 800px
→ 44px of the next spread bleeds through on screen.
```

**Fix:** `BookPageView` no longer trusts the `screenWidth` prop (from `useWindowDimensions()`, which includes notch insets). It now uses `onLayout` on the FlatList itself to measure its actual rendered width in pixels.