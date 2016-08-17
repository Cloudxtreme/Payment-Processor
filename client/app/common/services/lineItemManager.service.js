'use strict';

angular.module('paymentProcessor')
  .service('lineItemManager', lineItemManager);

function lineItemManager ($q, $http, loginManager, LineItem) {
	const service = this;

	/** Service Variables **/

	/** Service Functions **/
  service.getAll = _getAll;


	/****** Implementation ******/

  function _getAll (transactionId) {
    const deferred = $q.defer();

    $http.get(`api/transactions/${transactionId}/line_items/`, {headers: {'X-Auth': loginManager.getToken()}})
      .success(lineItems => deferred.resolve(_.map(lineItems, (lineItem) => new LineItem(lineItem))))
      .error(status => deferred.reject(status));

    return deferred.promise;
  }
}
