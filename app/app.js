import UserInfoDirective from './directives/userInfo';

let module = angular.module('chronogolf', [
    'ngSanitize',
    'ngMessages',
    'ui.select'
]);

module
    .directive('userInfo', UserInfoDirective);
