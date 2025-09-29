// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    baseUrl: 'http://localhost:3000/api', // Your backend API URL
    endpoints: {
      items: '/items'
    }
  },
  database: {
    type: 'mysql',
    host: 'database-1.cvayqu2e0wf2.us-east-1.rds.amazonaws.com',
    port: 3306,
    database: 'database-1',
    // Note: Database credentials should be handled securely in the backend
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
