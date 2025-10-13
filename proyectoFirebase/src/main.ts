import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideIonicAngular } from '@ionic/angular/standalone';

console.log('Application starting with mock authentication...');

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
  ],
}).catch(err => {
  console.error('Application bootstrap error:', err);
});
