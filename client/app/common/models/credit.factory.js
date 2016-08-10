'use strict';
angular.module('paymentProcessor')
  .factory('Credit', credit);

function credit() {

  // Constructor
  function Credit(creditData) {
    var model = this;
    if (creditData) { //Init-Constructor
      model.id = creditData.id;
      model.userId = creditData.userId;
      model.amount = creditData.amount;
      model.paidDate = (creditData.paidDate) ? new Date(creditData.paidDate * 1000) : '';
      model.createdDate = new Date(creditData.createdDate * 1000);
    } else { //Default Constructor
      model.id = null;
      model.userId = null;
      model.amount = 0;
      model.paidDate = '';
      model.createdDate = new Date();
    }
  }

  // Member Functions
  Credit.prototype = {
    // All Business Logic Functions
    formatForServer: function() {
      return {
        amount: this.amount,
        paidDate: this.paidDate
      };
    }
  };

  return Credit;
}
