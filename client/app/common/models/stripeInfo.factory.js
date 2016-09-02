'use strict';
angular.module('paymentProcessor')
  .factory('StripeInfo', stripeInfo);

const DEFAULT_STRIPE_INFO = {
  id: null,
  userId: null,
  accessToken: null,
  publishableKey: null,
  stripeUserId: null
};

function stripeInfo () {

  // Constructor
  function StripeInfo (stripeInfoData) {
    Object.assign(
      this,
      DEFAULT_STRIPE_INFO,
      {
        id: stripeInfoData.id,
        userId: stripeInfoData.userId,
        accessToken: stripeInfoData.accessToken,
        publishableKey: stripeInfoData.publishableKey,
        stripeUserId: stripeInfoData.stripeUserId
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
