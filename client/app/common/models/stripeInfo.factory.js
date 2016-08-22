'use strict';
angular.module('paymentProcessor')
  .factory('StripeInfo', stripeInfo);

const DEFAULT_STRIPE_INFO = {
  id: null,
  accessToken: null,
  publishableKey: null,
  userID: null 
};

function stripeInfo () {

  // Constructor
  function StripeInfo (stripeInfoData) {
    Object.assign(
      this,
      DEFAULT_STRIPE_INFO,
      {
        id: stripeInfoData.id,
        accessToken: stripeInfoData.accessToken,
        publishableKey: stripeInfoData.publishableKey,
        userID: stripeInfoData.userId
      }
    );
  }

  // Member Functions
  StripeInfo.prototype = {
    fetch: function () {

    }
  };

  return StripeInfo;
}
