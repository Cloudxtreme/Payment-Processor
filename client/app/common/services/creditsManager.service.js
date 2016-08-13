'use strict';

angular.module('paymentProcessor')
  .service('creditsManager', creditsManager);

function creditsManager ($q, $http, loginManager, Credit) {
	const service = this;

	/** Service Variables **/

	/** Service Functions **/
  service.getAll = _getAll;


	/****** Implementation ******/

  function _getAll () {
    const deferred = $q.defer();

    $http.get('api/credits', {headers: {'X-Auth': loginManager.getToken()}})
      .success(credits => deferred.resolve(_.map(credits, (credit) => {
        const newCredit = new Credit(credit);

        newCredit.fetch();

        return newCredit;
      })))
      .error(status => deferred.reject(status));

    return deferred.promise;
  }
}
