import { UserInfoControllerName } from '../controllers/userInfo.controller';
import * as userInfoTemplate from '../templates/user_info.html';

export const userInfoComponentName = 'userInfo';

const userInfoComponent: angular.IComponentOptions = {
  bindings: { user: '=?' },
  template: userInfoTemplate as any,
  controller: UserInfoControllerName,
};

export default userInfoComponent;
