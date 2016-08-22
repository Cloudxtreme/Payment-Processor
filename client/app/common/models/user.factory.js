'use strict';
angular.module('paymentProcessor')
  .factory('User', user);

const MILLISECONDS_IN_MICROSECONDS = 1000;
const DEFAULT_USER = {
  id: null,
  email: '',
  admin: false,
  companyName: '',
  firstName: '',
  lastName: '',
  createdDate: new Date()
};

function user (stripeInfoManager) {

  // Constructor
  function User (userData) {
    Object.assign(
      this,
      DEFAULT_USER,
      {
        id: userData.id,
        email: userData.email,
        admin: userData.admin,
        companyName: userData.companyName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdDate: new Date(userData.createdDate * MILLISECONDS_IN_MICROSECONDS),
        stripeInfo: new StripeInfo()
      }
    );
  }

  // Member Functions
  User.prototype = {
    fetch: function () {
      stripeInfoManager.getInfo(this.id).then(stripeInfo => this.stripInfo = stripInfo);      
    }
  };

  return User;
}
