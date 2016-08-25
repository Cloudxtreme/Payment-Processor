'use strict';

angular.module('paymentProcessor')
  .service('paymentManager', paymentManager);

// TODO: Move to .env
const CLIENT_ID = 'sk_test_6Kf4KR8zODs92rC4LNX5DXNn';

function paymentManager ($q, $http) {
	const service = this;

	/** Service Variables **/

	/** Service Functions **/
  service.createToken = _createToken;
  service.createCharge = _createCharge;

	/****** Implementation ******/

  function _createToken (card) {
    const deferred = $q.defer();

    console.log(card);
    $http({
      url: `https://api.stripe.com/v1/tokens`,
      method: "POST",
      params: card.forStripeServer(),
      headers: {'Authorization': `Bearer ${CLIENT_ID}`}
    }).success(tokenObj => {
        deferred.resolve({token: tokenObj.id});
      })
      .error((data, status) => deferred.reject(status));

    return deferred.promise;
  }

  function _createCharge (charge) {
    const deferred = $q.defer();

    $http({
      url: `https://api.stripe.com/v1/charges`,
      method: "POST",
      params: charge.forStripeServer(),
      headers: {'Authorization': `Bearer ${CLIENT_ID}`}
    }).success(chargeObj => {
        deferred.resolve(chargeObj);
      })
      .error((data, status) => deferred.reject(status));

    return deferred.promise;
  }
}
