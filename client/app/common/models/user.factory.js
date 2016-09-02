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
  createdDate: new Date(),
  stripeInfo: {}
};

function user () {

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
        stripeInfo: userData.stripeInfo || {}
      }
    );
  }

  // Member Functions
  User.prototype = {

  };

  return User;
}
