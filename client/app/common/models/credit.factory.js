'use strict';
angular.module('paymentProcessor')
  .factory('Credit', credit);

const MILLISECONDS_IN_MICROSECONDS = 1000;
const DEFAULT_CREDIT = {
  id: null,
  userId: null,
  projectName: '',
  paymentNumber: 0,
  amount: 0,
  paidDate: '',
  createdDate: new Date(),
  lineItems: []
};

function credit (lineItemManager) {

  // Constructor
  function Credit (creditData) {
    Object.assign(
      this,
      DEFAULT_CREDIT,
      {
        id: creditData.id,
        userId: creditData.userId,
        projectName: creditData.projectName,
        paymentNumber: creditData.paymentNumber,
        amount: creditData.amount,
        paidDate: creditData.paidDate || new Date(creditData.paidDate * MILLISECONDS_IN_MICROSECONDS),
        createdDate: new Date(creditData.createdDate * MILLISECONDS_IN_MICROSECONDS),
        lineItems: creditData.lineItems
      }
    );
  }

  // Member Functions
  Credit.prototype = {
    // All Business Logic Functions
    formatForServer: function () {
      return {
        amount: this.amount,
        paidDate: this.paidDate
      };
    },

    fetch: function () {
      const model = this;

      const _setLineItems = (lineItems) => {
        model.lineItems = lineItems;
      };

      lineItemManager.getAll(model.id).then(_setLineItems);
    }
  };

  return Credit;
}
