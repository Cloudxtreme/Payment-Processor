'use strict';
angular.module('paymentProcessor')
  .factory('Transaction', transaction);

const TEN = 10;
const MILLISECONDS_IN_MICROSECONDS = 1000;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DEFAULT_TRANSACTION = {
  id: null,
  creditorId: null,
  debtorId: null,
  projectName: '',
  companyName: '',
  paymentNumber: 0,
  paidDate: '',
  createdDate: new Date(),
  lineItems: []
};

function transaction (lineItemManager) {

  // Constructor
  function Transaction (transactionData) {
    Object.assign(
      this,
      DEFAULT_TRANSACTION,
      {
        id: transactionData.id,
        creditorId: transactionData.creditorId,
        debtorId: transactionData.debtorId,
        projectName: transactionData.projectName,
        companyName: transactionData.companyName,
        paymentNumber: transactionData.paymentNumber,
        paidDate: transactionData.paidDate && new Date(transactionData.paidDate * MILLISECONDS_IN_MICROSECONDS),
        createdDate: new Date(transactionData.createdDate * MILLISECONDS_IN_MICROSECONDS),
        lineItems: transactionData.lineItems
      }
    );
  }

  // Member Functions
  Transaction.prototype = {
    // All Business Logic Functions
    forServer: function () {
      return {
        creditorId: this.creditorId,
        debtorId: this.debtorId,
        projectName: this.projectName,
        companyName: this.companyName,
        paymentNumber: this.paymentNumber,
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
    },
    isAnIncome: function (userId) {
      return this.creditorId === userId;
    },
    isAnExpenditure: function (userId) {
      return this.debtorId === userId;
    }

  };

  return Transaction;
}
