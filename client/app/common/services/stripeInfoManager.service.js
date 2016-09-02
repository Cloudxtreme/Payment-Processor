'use strict';

angular.module('paymentProcessor')
  .service('stripeInfoManager', stripeInfoManager);

function stripeInfoManager ($q, $http, $state, StripeInfo) {
	const service = this;

	/** Service Variables **/

	/** Service Functions **/
  service.getInfo = _getInfo;
  service.createInfo = _createInfo;
  service.deleteInfo = _deleteInfo;

	/****** Implementation ******/

	function _getInfo (userId, token) {
		const deferred = $q.defer();

    $http.get(`api/users/${userId}/stripe_info`, {headers: {'X-Auth': token}})
      .success(stripeInfoData => {
        const info = new StripeInfo(stripeInfoData);

        info.fetch();
        deferred.resolve(info);
      })
      .error((data, status) => deferred.reject(status));

		return deferred.promise;
  }

  function _createInfo (userId, stripeInfo, token) {
    const deferred = $q.defer();

    $http({
      url: `api/users/${userId}/stripe_info`,
      method: "POST",
      data: stripeInfo,
      headers: {'X-Auth': token}
    }).success(stripeInfoData => {
        const info = new StripeInfo(stripeInfoData);

        info.fetch();
        deferred.resolve(info);
      })
      .error((data, status) => deferred.reject(status));

		return deferred.promise;
  }

  function _deleteInfo (userId, token) {
    const deferred = $q.defer();

    $http({
      url: `api/users/${userId}/stripe_info`,
      method: "DELETE",
      headers: {'X-Auth': token}
    }).success(() => {
        deferred.resolve();
      })
      .error((data, status) => deferred.reject(status));

		return deferred.promise;
  }
}
