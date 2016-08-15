'use strict';
angular.module('paymentProcessor')
  .factory('Credit', credit);

const TEN = 10;
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
        paidDate: creditData.paidDate && new Date(creditData.paidDate * MILLISECONDS_IN_MICROSECONDS),
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
    },

    isPaid: function () {

      return Boolean(this.paidDate);
    },
    formattedCreatedDate: function () {
      const day = this.createdDate.getDate() < TEN ? `0${this.createdDate.getDate()}` : this.createdDate.getDate();
      const month = this.createdDate.getMonth() < TEN ? `0${this.createdDate.getMonth()}` : this.createdDate.getMonth();

      return `${month}/${day}/${this.createdDate.getUTCFullYear()}`;
    },
    formattedPaymentNumber: function () {

      return this.paymentNumber < TEN ? `0${this.paymentNumber}` : this.paymentNumber;
    }

  };

  return Credit;
}
