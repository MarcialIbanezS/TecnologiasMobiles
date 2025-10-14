// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { initializeApp } from "firebase/app"; //Agregar
import { getAnalytics } from "firebase/analytics";//Agregar

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBko6PFIC3QOZ3CXtsyN-4vrFJR2ooAeas",
  authDomain: "appmoviles-b5003.firebaseapp.com",
  projectId: "appmoviles-b5003",
  storageBucket: "appmoviles-b5003.firebasestorage.app",
  messagingSenderId: "264276022373",
  appId: "1:264276022373:web:66db567fd6ee7d225b628c",
  measurementId: "G-RXGREWNXX8"
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
