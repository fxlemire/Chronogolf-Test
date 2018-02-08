import * as angular from 'angular';
import { Customer } from '../interfaces';
import UserInfoService from '../services/userInfo.service';

export const UserInfoControllerName = 'UserInfoController';

class UserInfoController {
  public formUserInfo: angular.IFormController;
  public loading = true;
  public resultsInfo: { length: number };
  public searchResults: Customer[];
  public user: Customer;

  private customersCollection: Customer[];

  constructor(
    private $timeout: angular.ITimeoutService,
    private $q: angular.IQService,
    private userInfoService: UserInfoService,
  ) {
    this.customersCollection = this.userInfoService.getCustomers();
  }

  closeResults() {
    this.searchResults = [];
  }

  onUserChange(attribute) {
    const value = this.user[attribute];

    if (value) {
      this.searchUser(attribute, value);
    } else {
      this.closeResults();
    }
  }

  resetUser() {
    this.user = {} as Customer;
  }

  setUser(user) {
    this.bindUser(user);
    (this.user as any).$autocompleted = true;
    this.formUserInfo.$setPristine();
    this.closeResults();
  }

  private bindUser = user => angular.extend(this.user, user);

  private hasMinimumOfCharacters(attribute, value) {
    switch (attribute) {
      case 'email':
        return value.length >= 7;
      case 'id':
        return value.length >= 1;
      case 'firstName':
        return false;
      default:
        return value.length >= 3;
    }
  }

  private searchUser(prop, value) {
    const deferred = this.$q.defer();

    if (this.hasMinimumOfCharacters(prop, value)) {
      console.info('SEARCH USER', prop, value); // tslint:disable-line no-console

      const usersFound = this.customersCollection.filter(item => item[prop] && item[prop].toString().toLowerCase().indexOf(value) !== -1);

      if (prop === 'email' && usersFound.length === 1) {
        this.setUser(usersFound[0]);
      } else {
        this.searchResults = usersFound;
        this.setResultsInfo();
      }

      this.$timeout(
        () => {
          this.loading = false;
          deferred.resolve(usersFound);
        },
        500,
      );
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  }

  private setResultsInfo() {
    this.resultsInfo = {
      length: this.searchResults.length,
    };
  }
}

export default UserInfoController;
