'use strict';
angular.module('paymentProcessor')
  .factory('Credit', credit);

const TEN = 10;
const MILLISECONDS_IN_MICROSECONDS = 1000;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DEFAULT_CREDIT = {
  id: null,
  userId: null,
  projectName: '',
  companyName: '',
  paymentNumber: 0,
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
        companyName: creditData.companyName,
        paymentNumber: creditData.paymentNumber,
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
        projectName: this.projectName,
        companyName: this.companyName,
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
    amount: function () {

      return _.map(this.lineItems, (lineItem) => lineItem.amount).reduce((prev, next) => prev + next, 0);
    },
    isPaid: function () {

      return Boolean(this.paidDate);
    },
    formattedCreatedDateTwo: function () {
      const day = this.createdDate.getDate() < TEN ? `0${this.createdDate.getDate()}` : this.createdDate.getDate();
      const month = MONTH_NAMES[this.createdDate.getMonth()];

      return `${month} ${day}, ${this.createdDate.getUTCFullYear()}`;
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
