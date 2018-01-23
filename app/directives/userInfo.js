import customersCollection from '../data/customers';
import filter from 'lodash/filter';

function UserInfoDirective($timeout, $q, $http) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      user: '=?'
    },
    templateUrl: '/assets/templates/user_info.html',
    link: function(scope, element, attrs) {

      var bind_user, hasMinimumOfCharacters, searchUser, setUser;

      /*******************************/
      /*            PUBLIC           */
      /*******************************/

      scope.onUserChange = function(attribute) {
        var value;
        value = scope.user[attribute];
        if (value) {
          searchUser(attribute, value);
        } else {
          scope.closeResults();
        }
      };

      scope.resetUser = function()
      {
        scope.user = new Object();
      };

      scope.closeResults = function() {
        scope.searchResults = [];
      };

      scope.setUser = function(user) {
        bind_user(user)
        scope.user.$autocompleted = true;
        scope.formUserInfo.$setPristine()
        scope.closeResults();
      };

      /*******************************/
      /*           PRIVATE           */
      /*******************************/

      bind_user = function(user) {
        angular.extend(scope.user, user);
      };

      hasMinimumOfCharacters = function(attribute, value) {
        if (attribute == 'email') {
         return value.length >= 7;
        } else if (attribute == 'memberNo') {
          return value.length >= 1
        } else if (attribute == 'firstName') {
          return false;
        } else {
          return value.length >= 3
        }
      };

      searchUser = function(prop, value)
      {

        let deferred = $q.defer();

        if (hasMinimumOfCharacters(prop, value)) {

          console.info("SEARCH USER", prop, value);

          let usersFound = filter(customersCollection, item => (item[prop] && item[prop].toString().toLowerCase().indexOf(value) != -1));

          if (prop == 'email' && usersFound.length == 1) {
            scope.setUser(usersFound[0]);
          } else {
            scope.searchResults = usersFound
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

      function setResultsInfo() {
        scope.resultsInfo = {
          length: scope.searchResults.length
        };
      };

    }
  };
};


export default UserInfoDirective;
