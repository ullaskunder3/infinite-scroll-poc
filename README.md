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