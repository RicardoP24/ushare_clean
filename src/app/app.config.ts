import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { environment } from '../environments/environment.prod';
import {getStorage, provideStorage} from '@angular/fire/storage';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch()),
  provideRouter(routes),
  provideClientHydration(), 
     provideAnimationsAsync(),
     importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebaseConfig),

      AngularFireStorageModule
     ),
      //  provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), 
      //  provideStorage(() => getStorage()), provideRemoteConfig(() => getRemoteConfig())
  
  ]
};
