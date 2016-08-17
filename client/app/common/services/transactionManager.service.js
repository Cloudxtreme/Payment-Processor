'use strict';

angular.module('paymentProcessor')
  .service('transactionsManager', transactionsManager);

function transactionsManager ($q, $http, loginManager, Transaction) {
	const service = this;

	/** Service Variables **/

	/** Service Functions **/
  service.getAll = _getAll;


	/****** Implementation ******/

  function _getAll () {
    const deferred = $q.defer();

    $http.get('api/transactions', {headers: {'X-Auth': loginManager.getToken()}})
      .success(transactions => deferred.resolve(_.map(transactions, (transaction) => {
        const newTransaction = new Transaction(transaction);

        newTransaction.fetch();

        return newTransaction;
      })))
      .error(status => deferred.reject(status));

    return deferred.promise;
  }
}
