// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  TAILWIND_MODE: 'build',
  firebase: {
    apiKey: 'AIzaSyCCCeF6lkUUc3AhUj4iBfY6Q4zxhyAK0Ag',
    authDomain: 'weather-app-e36ff.firebaseapp.com',
    databaseURL:
      'https://weather-app-e36ff-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'weather-app-e36ff',
    storageBucket: 'weather-app-e36ff.appspot.com',
    messagingSenderId: '73414307578',
    appId: '1:73414307578:web:1a1edaaf1ee8815ce32343',
  },
  openweathermap: 'https://api.openweathermap.org/data/2.5/weather',
  appId: '4d219cd7788cf8cb86b421ba87825cbe',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
