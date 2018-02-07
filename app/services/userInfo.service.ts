import { Customer } from '../interfaces';

const customersCollection: Customer[] = require('../data/customers');

export const userInfoServiceName = 'userInfoService';

class UserInfoService {
  constructor() {}

  getCustomers() {
    return customersCollection;
  }
}

export default UserInfoService;
