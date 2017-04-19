import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { COMPILER_PROVIDERS } from '@angular/compiler';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic([COMPILER_PROVIDERS]).bootstrapModule(AppModule);
