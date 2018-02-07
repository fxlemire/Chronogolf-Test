import userInfoComponent, { userInfoComponentName } from './components/userInfo.component';
import UserInfoController, { UserInfoControllerName } from './controllers/userInfo.controller';
import UserInfoService, { userInfoServiceName } from './services/userInfo.service';

const module = angular.module('chronogolf', [
  'ngSanitize',
  'ngMessages',
  'ui.select',
]);

module
  .component(userInfoComponentName, userInfoComponent)
  .controller(UserInfoControllerName, UserInfoController)
  .service(userInfoServiceName, UserInfoService);
