import UserInfoDirective from './directives/userInfo';

const module = angular.module('chronogolf', [
    'ngSanitize',
    'ngMessages',
    'ui.select'
]);

module
    .directive('userInfo', UserInfoDirective);
