export const environment = {
  production: true,
  api: {
    baseUrl: 'https://your-production-api.com/api', // Your production backend API URL
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
