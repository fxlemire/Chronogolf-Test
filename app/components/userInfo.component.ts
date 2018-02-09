import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { Customer } from '../interfaces';
import { UserInfoService } from '../services/userInfo.service';
import * as userInfoTemplate from '../templates/user_info.html';

export const userInfoComponentName = 'appUserInfo';

@Component({
  selector: 'app-user-info',
  template: userInfoTemplate as any,
})
export class UserInfoComponent {
  public displayedColumns = ['id', 'first', 'last', 'phone', 'email'];
  public loading = true;
  public resultsInfo: { length: number };
  public searchResults: MatTableDataSource<Customer>;
  public user: Customer = {} as Customer;

  private customersCollection: Customer[];

  constructor(@Inject('userInfoService') private userInfoService: UserInfoService) {
    this.customersCollection = this.userInfoService.getCustomers();
  }

  closeResults() {
    this.searchResults = undefined;
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
    this.closeResults();
  }

  private bindUser = (user) => { this.user = { ...this.user, ...user }; };

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
    if (this.hasMinimumOfCharacters(prop, value)) {
      console.info('SEARCH USER', prop, value); // tslint:disable-line no-console

      const usersFound = this.customersCollection.filter(item => item[prop] && item[prop].toString().toLowerCase().indexOf(value) !== -1);

      if (prop === 'email' && usersFound.length === 1) {
        this.setUser(usersFound[0]);
      } else {
        this.searchResults = new MatTableDataSource(usersFound);
        this.setResultsInfo();
      }

      this.loading = false;

      return usersFound;
    }
  }

  private setResultsInfo() {
    this.resultsInfo = {
      length: this.searchResults.data.length,
    };
  }
}
