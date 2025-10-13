import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideIonicAngular } from '@ionic/angular/standalone';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, enableIndexedDbPersistence } from '@angular/fire/firestore';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const db = getFirestore();
      try { enableIndexedDbPersistence(db); } catch { /* ignora si hay múltiples pestañas */ }
      return db;
    }),
  ],
}).catch(err => console.error(err));
