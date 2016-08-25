'use strict';
angular.module('paymentProcessor')
  .factory('Destination', destination);

const DEFAULT_DESTINATION = {
  accountId: null
};

function destination () {

  // Constructor
  function Destination (destinationData) {
    Object.assign(
      this,
      DEFAULT_DESTINATION,
      {
        accountId: destinationData.accountId
      }
    );
  }

  // Member Functions
  Destination.prototype = {
    fetch: function () {

    }
  };

  return Destination;
}
