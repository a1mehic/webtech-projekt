import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// dieser Code sagt angular, starte deine applikation & starte es mit diesem Modul
// so parst angular (app.module.ts), registriert derern Komponenten welche deklariert
// und importiert manch andere Module
