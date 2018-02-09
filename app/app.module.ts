import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatTableModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoComponent } from './components/userInfo.component';
import hybridHelper from './hybrid-helper';
import { userInfoServiceName } from './services/userInfo.service';

import '@angular/material/prebuilt-themes/indigo-pink.css';

@NgModule({
  declarations: [
    UserInfoComponent,
  ],
  entryComponents: [
    UserInfoComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    NgbModule.forRoot(),
    UpgradeModule,
  ],
  providers: [
    hybridHelper.buildProviderForUpgrade(userInfoServiceName),
  ],
})
export class Ng2AppModule {
  constructor(private upgrade: UpgradeModule) { }

  ngDoBootstrap(): void {
    this.upgrade.bootstrap(document.documentElement, ['chronogolf']);
  }
}
