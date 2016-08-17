'use strict';
angular.module('paymentProcessor')
  .factory('LineItem', lineItem);

const MILLISECONDS_IN_MICROSECONDS = 1000;
const DEFAULT_LINE_ITEM = {
  id: null,
  userId: null,
  creditId: null,
  amount: 0,
  description: '',
  createdDate: new Date()
};

function lineItem () {

  // Constructor
  function LineItem (lineItemData) {
    Object.assign(
      this,
      DEFAULT_LINE_ITEM,
      {
        id: lineItemData.id,
        userId: lineItemData.userId,
        creditId: lineItemData.creditId,
        amount: lineItemData.amount,
        description: lineItemData.description,
        createdDate: new Date(lineItemData.createdDate * MILLISECONDS_IN_MICROSECONDS)
      }
    );
  }

  // Member Functions
  LineItem.prototype = {
    fetch: function () {
    }
  };

  return LineItem;
}
