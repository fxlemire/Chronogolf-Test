import * as customersCollection from '../data/customers.json';
import { Customer } from '../interfaces';

export const userInfoServiceName = 'userInfoService';

class UserInfoService {
  constructor() {}

  getCustomers(): Customer[] {
    return customersCollection as any as Customer[];
  }
}

export default UserInfoService;
