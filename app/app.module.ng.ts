import * as angular from 'angular';
import { UserInfoComponent, userInfoComponentName } from './components/userInfo.component';
import helper from './hybrid-helper';
import { UserInfoService, userInfoServiceName } from './services/userInfo.service';

import 'angular-messages/angular-messages.js';
import 'angular-sanitize/angular-sanitize.js';
import 'ui-select/dist/select.js';

import 'angular-material/angular-material.css';
import 'angular-material/angular-material.layouts.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'ui-select/dist/select.css';

import './app.scss';

export const Ng1AppModule = angular.module('chronogolf', [
  'ngSanitize',
  'ngMessages',
  'ui.select',
]);

Ng1AppModule
  .service(userInfoServiceName, UserInfoService);

helper.downgradeComponent('chronogolf', userInfoComponentName, UserInfoComponent);
