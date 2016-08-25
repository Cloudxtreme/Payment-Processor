'use strict';
angular.module('paymentProcessor')
  .factory('Card', card);

const DEFAULT_CARD = {
  number: -1,
  expMonth: -1,
  expYear: -1,
  cvc: -1
};

function card () {

  // Constructor
  function Card (cardData) {
    Object.assign(
      this,
      DEFAULT_CARD,
      {
        number: cardData.number,
        expMonth: cardData.expMonth,
        expYear: cardData.expYear,
        cvc: cardData.cvc
      }
    );
  }

  // Member Functions
  Card.prototype = {
    fetch: function () {

    },

    forStripeServer: function () {
      return {
        "card[number]": this.number,
        "card[exp_month]": this.expMonth,
        "card[exp_year]": this.expYear,
        "card[cvc]": this.cvc
      };
    }
  };

  return Card;
}
