'use strict';
angular.module('paymentProcessor')
  .factory('User', user);

function user() {

  // Constructor
  function User(userData) {
    var model = this;
    if (userData) { //Init-Constructor
      model.id = userData.id;
      model.email = userData.email;
      model.admin = userData.admin;
      model.firstName = userData.firstName;
      model.lastName = userData.lastName;
      model.createdDate = new Date(userData.createdDate * 1000);
    } else { //Default Constructor
      model.id = null;
      model.email = '';
      model.admin = false;
      model.firstName = '';
      model.lastName = '';
      model.createdDate = new Date();
    }
  }

  // Member Functions
  User.prototype = {
    // All Business Logic Functions
    someFunctions: function() {
    }
  };

  return User;
}
