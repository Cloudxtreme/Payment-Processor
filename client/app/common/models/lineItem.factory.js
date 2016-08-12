'use strict';
angular.module('paymentProcessor')
  .factory('LineItem', lineItem);

const MILLISECONDS_IN_MICROSECONDS = 1000;
const DEFAULT_LINE_ITEM = {
  id: null,
  userId: null,
  creditId: null,
  amount: 0,
  createdDate: new Date()
};

function lineItem (nestedAttributeFetcher) {

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
        createdDate: new Date(lineItemData.createdDate * MILLISECONDS_IN_MICROSECONDS)
      }
    );
  }

  // Member Functions
  LineItem.prototype = {
    fetch: function (attribute) {
     return nestedAttributeFetcher(this, attribute);
    }
  };

  return LineItem;
}
