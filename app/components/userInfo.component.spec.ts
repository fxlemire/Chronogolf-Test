import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatTableModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Customer } from '../interfaces';
import { userInfoServiceName } from '../services/userInfo.service';
import { UserInfoComponent } from './userInfo.component';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  let userInfoServiceStub: {
    getCustomers(): Promise<Customer[]>,
  };

  const helper = {
    searchUser(attribute, value) {
      component.user[attribute] = value;
      component.onUserChange(attribute);
    },
  };

  beforeEach(async(() => {
    userInfoServiceStub = {
      getCustomers(): Promise<Customer[]> {
        return Promise.resolve([
          {
            lastName: 'addy',
            firstName: 'abigail',
            phone: '153-316-6318',
            id: 225,
            email: 'abigail.addy@example.com',
          }, {
            lastName: 'chan',
            firstName: 'abigail',
            phone: '539-235-0263',
            id: 11,
            email: 'abigail.chan@example.com',
          },
        ]);
      },
    };

    TestBed.configureTestingModule({
      declarations: [UserInfoComponent],
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        NgbModule.forRoot(),
      ],
      providers: [
        { provide: userInfoServiceName, useValue: userInfoServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be loading', async(() => {
    expect(component.loading).toBeTruthy();
  }));

  it('should not search if not enough characters', async(() => {
    helper.searchUser('lastName', 'ad');
    expect(component.searchResults).toBeUndefined();
  }));

  it('should properly search a user', async(() => {
    helper.searchUser('lastName', 'add');
    expect(component.searchResults.data.length).toBe(1);
  }));

  it('should not find an unexisting user', async(() => {
    helper.searchUser('firstName', 'gordon');
    expect(component.searchResults).toBeUndefined();
  }));
});
