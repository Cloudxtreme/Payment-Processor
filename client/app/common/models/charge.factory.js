'use strict';
angular.module('paymentProcessor')
  .factory('Charge', charge);

function charge (Source, Destination) {
  const DEFAULT_CHARGE = {
    amount: 0,
    source: new Source(),
    destination: new Destination()
    // TODO: Some attrs  
  };

  // Constructor
  function Charge (chargeData) {
    Object.assign(
      this,
      DEFAULT_CHARGE,
      {
        amount: chargeData.amount,
        source: chargeData.source,
        destination: chargeData.destination
        // some attrs   
      }
    );
  }

  // Member Functions
  Charge.prototype = {
    fetch: function () {

    }
  };

  return Charge;
}
