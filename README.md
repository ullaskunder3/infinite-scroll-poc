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
