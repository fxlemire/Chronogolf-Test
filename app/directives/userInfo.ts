import filter from 'lodash/filter';
import { Customer } from '../interfaces';

const customersCollection: Customer[] = require('../data/customers');

function UserInfoDirective($timeout, $q, $http) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      user: '=?'
    },
    templateUrl: '/assets/templates/user_info.html',
    link: function(scope, element, attrs) {
      /*******************************/
      /*           PRIVATE           */
      /*******************************/

      const bind_user = user => angular.extend(scope.user, user);

      const setResultsInfo = () => {
        scope.resultsInfo = {
          length: scope.searchResults.length
        };
      };

      const hasMinimumOfCharacters = function(attribute, value) {
        if (attribute === 'email') {
         return value.length >= 7;
        } else if (attribute === 'memberNo') {
          return value.length >= 1;
        } else if (attribute === 'firstName') {
          return false;
        } else {
          return value.length >= 3;
        }
      };

      const searchUser = (prop, value) => {
        const deferred = $q.defer();

        if (hasMinimumOfCharacters(prop, value)) {
          console.info('SEARCH USER', prop, value); // tslint:disable-line no-console

          const usersFound = customersCollection.filter(item => (item[prop] && item[prop].toString().toLowerCase().indexOf(value) !== -1));

          if (prop === 'email' && usersFound.length === 1) {
            scope.setUser(usersFound[0]);
          } else {
            scope.searchResults = usersFound;
            setResultsInfo();
          }

          $timeout(() => {
            scope.loading = false;
            deferred.resolve(usersFound);
          }, 500);
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      };

      /*******************************/
      /*            PUBLIC           */
      /*******************************/

      scope.onUserChange = (attribute) => {
        const value = scope.user[attribute];

        if (value) {
          searchUser(attribute, value);
        } else {
          scope.closeResults();
        }
      };

      scope.resetUser = () => {
        scope.user = new Object();
      };

      scope.closeResults = () => {
        scope.searchResults = [];
      };

      scope.setUser = (user) => {
        bind_user(user);
        scope.user.$autocompleted = true;
        scope.formUserInfo.$setPristine();
        scope.closeResults();
      };
    }
  };
}

export default UserInfoDirective;
