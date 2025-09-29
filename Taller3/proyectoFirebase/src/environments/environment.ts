// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { initializeApp } from "firebase/app"; //Agregar
import { getAnalytics } from "firebase/analytics";//Agregar

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyA7fwtGw_rNXCFJl0o2j8O0mVS022ADrig",
    authDomain: "proyectoejemplo-e6759.firebaseapp.com",
    projectId: "proyectoejemplo-e6759",
    storageBucket: "proyectoejemplo-e6759.firebasestorage.app",
    messagingSenderId: "576366517575",
    appId: "1:576366517575:web:085a1e89e7580c5d88c062",
    measurementId: "G-J0RRJDTWKW"
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
