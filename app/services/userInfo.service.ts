import '../data/customers.json';
import { Customer } from '../interfaces';

export const userInfoServiceName = 'userInfoService';

export class UserInfoService {
  constructor(private $http: angular.IHttpService) {}

  async getCustomers(): Promise<Customer[]> {
    return new Promise((resolve, reject) => {
      this.$http({
        method: 'GET',
        url: '/assets/data/customers.json',
      }).then((res) => {
        resolve(res.data as Customer[]);
      }).catch(reject);
    }) as Promise<Customer[]>;
  }
}
