'use strict';
angular.module('paymentProcessor')
  .factory('Charge', charge);

// TODO: Move to .env
const APPLICATION_FEE = 15;
const CURRENCY = 'usd';
const STATEMENT_DESCRIPTOR = 'Payment Processor';

function charge (Source, Destination) {
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
        "currency": CURRENCY,
        "source": this.source.token,
        "destination": this.destination.accountId,
        "description": this.description,
        "application_fee": APPLICATION_FEE,
        "statement_descriptor": STATEMENT_DESCRIPTOR
      };
    }
  };

  return Charge;
}
