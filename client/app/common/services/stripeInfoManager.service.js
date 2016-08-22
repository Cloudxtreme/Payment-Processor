'use strict';

angular.module('paymentProcessor')
  .service('stripeInfoManager', stripeInfoManager);

function stripeInfoManager ($q, $http, $state, StripeInfo, loginManager) {
	const service = this;

	/** Service Variables **/

	/** Service Functions **/
  service.getInfo = _getInfo;
  service.createInfo = _createInfo;

	/****** Implementation ******/

	function _getInfo (userId) {
		const deferred = $q.defer();

    $http.get(`api/user/${userId}/stripe_info`, {headers: {'X-Auth': loginManager.getToken()}})
      .success(stripe_info_data => {
        const info = new StripeInfo(stripe_info_data);
        info.fetch();
        deferred.resolve(info);
      })
      .error((data, status) => deferred.reject(status));

		return deferred.promise;
  }

  function _createInfo (userId, stripeInfo) {
    const deferred = $q.defer();

    $http.post(`api/user/${userId}/stripe_info`, {headers: {'X-Auth': loginManager.getToken()}}, stripeInfo)
      .success(stripe_info_data => {
        const info = new StripeInfo(stripe_info_data);
        info.fetch();
        deferred.resolve(info);
      })
      .error((data, status) => deferred.reject(status));

		return deferred.promise;
  }
}
