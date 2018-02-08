import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule,
  ],
})
export class Ng2AppModule {
  constructor(private upgrade: UpgradeModule) { }

  ngDoBootstrap(): void {
    this.upgrade.bootstrap(document.documentElement, ['chronogolf']);
  }
}
