'use strict';

angular.module('paymentProcessor')
  .service('transactionsManager', transactionsManager);

function transactionsManager ($q, $http, loginManager, Transaction) {
	const service = this;

	/** Service Variables **/
  service.transactions = null;

	/** Service Functions **/
  service.getAll = _getAll;
  service.thatAreIncomes = _thatAreIncomes;


	/****** Implementation ******/

  function _getAll () {
    const deferred = $q.defer();

    if (service.transactions) {
      deferred.resolve(service.transactions);
    } else {
      $http.get('api/transactions', {headers: {'X-Auth': loginManager.getToken()}})
        .success(transactions => deferred.resolve(_.map(transactions, (transaction) => {
          const newTransaction = new Transaction(transaction);

          newTransaction.fetch();

          return newTransaction;
        })))
        .error(status => deferred.reject(status));
    }

    return deferred.promise;
  }

  function _thatAreIncomes (userId, transactions) {
    return _.filter(transactions, (transaction) => transaction.isACredit(userId));
  }
}
