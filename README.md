change npm to pnpm
pnpm import
rm -rf node_modules package-lock.json
pnpm install

https://reactnavigation.org/docs/getting-started
pnpm add @react-navigation/native


pnpm add @react-navigation/bottom-tabs

will be using feature base architecture instead of funcation base becasue files are scattered across teh codebase and it can get messy as project grows


prompt
 have a local backend running at http://localhost:3001.
Please fetch http://localhost:3001/openapi.json (or inspect the endpoints /stories, /stories/{id}, /chapters?story={id}, /chapters/{id}), analyze all request/response schemas, and
generate clean TypeScript interfaces for all data contracts, query parameters, and error objects in a types.ts file.


Error:
Console Error

Internal React error: Expected static flag was missing. Please notify the React team.

Source:
/home/ullaskunder/dev-work/projects/FanonAppAssignment/node_modules/react-native/Libraries/LogBox/Data/LogBoxData.js (235:38)

Call Stack:
addLog (/home/ullaskunder/dev-work/projects/FanonAppAssignment/node_modules/react-native/Libraries/LogBox/Data/LogBoxData.js:235)
addConsoleLog (/home/ullaskunder/dev-work/projects/FanonAppAssignment/node_modules/react-native/Libraries/LogBox/LogBox.js:213)
reactConsoleErrorHandler (/home/ullaskunder/dev-work/projects/FanonAppAssignment/node_modules/react-native/Libraries/Core/ExceptionsManager.js:248)


using cursor-based pagination:

 we have feature base architecture: next for home cleanup and seperation of concern

 using zustand so we can avoid prop drilling accross screena and tabs

 home can call open story 
   2. **HomeScreen.tsx**:
      • Directly calls const openStory = useAppStore((s) => s.
      openStory).
      • Zero callback prop drilling through AppNavigator /
      AppTabs.
  3. **StoryDetailScreen.tsx**:
      • Directly reads selectedStoryId, closeStory, and
      openChapter from the store.
  4. **AppNavigator.tsx**:
      • Simplified to pure tab navigation; listens to
      selectedStoryId to transition seamlessly.


hyy make chapter list page collapsable to chapters so from
  reader if user have that list icon of back icon it can show
  colapsed list of chapter page ?

lets optimize the comic reader page currently its rendering all page at once BAD 
so lets do this initial page to render 2 to 3 only load visible first 
windows size 5 keeps only 2 viewport ahead behind in memory 
skeleton placeholder smooth loading react-native-skeleton-loading

avoid pyramid of doom and
 Extract the conditional rendering logic into separate
  variables or handling the loading/error states upfront makes
  the main return statement extremely clean

  in comicreaderScreen line 70

zoom scale + asyncstorage -> survices chaper change app restarts
pagewidth = width*zoomscale

have added svg animation loader.svg use that for commic reader
  shwo that intill we have data properly instead of any spinner
  or skeleton

  VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {dt: 606, prevDt: 694, contentLength: 5696}

### Physical & Virtual Device API Setup
- **Issue:** Virtual emulator uses `10.0.2.2`, but physical device over USB cannot reach it.
- **Fix:** Set API URL to `http://localhost:3001` and forward port 3001 to both devices using ADB:
  ```bash
  adb reverse tcp:3001 tcp:3001
  ```
- **Result:** Both physical USB phone and virtual emulator connect directly to the local backend without Wi-Fi IP issues.
---

I noticed that when I scroll fast in Reader, a loader appears. Is this due to API latency or our implementation?

Webtoon feels seamless even with fast scrolling. Can we check how they handle it and see if we can make our scrolling experience smoother?

----
i was just checking rotated view for book view
  kind of overflwoing to next page and does not look like how
  pages are connected pivite of left page right edge and right
  page left edge what is the reason ?

    Root cause explained:
    useWindowDimensions().width = 844px   ← full screen (notch
  included)
    SafeAreaView (left + right edges)     ← cuts ~22px each
  side for notch
    FlatList actual rendered width = 800px ← what pagingEnabled
  snaps to
    
    Each BookViewItem was rendered at 844px wide
    but the FlatList paged every 800px
    → 44px bleed-through from the next spread visible on screen
  What was fixed:

  Instead of trusting screenWidth prop (which comes from
  useWindowDimensions() and includes notch insets),
  BookPageView now uses onLayout on the FlatList itself to
  measure its actual rendered width in pixels.