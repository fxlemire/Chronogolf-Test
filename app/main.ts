import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Ng2AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(Ng2AppModule);
