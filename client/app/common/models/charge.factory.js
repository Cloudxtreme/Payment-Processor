'use strict';
angular.module('paymentProcessor')
  .factory('Charge', charge);

function charge (Source, Destination, STRIPE_APPLICATION_FEE, STRIPE_API_CURRENCY, STRIPE_API_STATEMENT_DESCRIPTOR) {
  const DEFAULT_CHARGE = {
    amount: 0,
    source: new Source({}),
    destination: new Destination({}),
    description: ''
  };

  // Constructor
  function Charge (chargeData) {
    Object.assign(
      this,
      DEFAULT_CHARGE,
      {
        amount: chargeData.amount,
        source: chargeData.source,
        destination: chargeData.destination,
        description: chargeData.description
      }
    );
  }

  // Member Functions
  Charge.prototype = {
    fetch: function () {

    },
    forStripeServer: function () {
      console.log(this);

      return {
        "amount": this.amount,
        "currency": STRIPE_API_CURRENCY,
        "source": this.source.token,
        "destination": this.destination.accountId,
        "description": this.description,
        "application_fee": STRIPE_APPLICATION_FEE,
        "statement_descriptor": STRIPE_API_STATEMENT_DESCRIPTOR
      };
    }
  };

  return Charge;
}
