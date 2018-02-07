import { UserInfoControllerName } from '../controllers/userInfo.controller';

export const userInfoComponentName = 'userInfo';

const userInfoComponent: angular.IComponentOptions = {
  bindings: { user: '=?' },
  templateUrl: '/assets/templates/user_info.html',
  controller: UserInfoControllerName,
};

export default userInfoComponent;
