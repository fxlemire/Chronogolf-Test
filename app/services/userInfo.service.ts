import * as customersCollection from '../data/customers.json';
import { Customer } from '../interfaces';

export const userInfoServiceName = 'userInfoService';

export class UserInfoService {
  getCustomers(): Customer[] {
    return customersCollection as any as Customer[];
  }
}
