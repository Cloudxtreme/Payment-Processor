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
  service.thatAreExpenditures = _thatAreExpenditures;


	/****** Implementation ******/

  function _getAll () {
    const deferred = $q.defer();

    if (service.transactions) {
      deferred.resolve(service.transactions);
    } else {
      $http.get('api/transactions', {headers: {'X-Auth': loginManager.getToken()}})
        .success(transactions => {
          service.transactions = _.map(transactions, (transaction) => _buildTransaction(transaction));
          deferred.resolve(service.transactions);
        })
        .error(status => deferred.reject(status));
    }

    return deferred.promise;
  }

  function _thatAreIncomes (userId, transactions) {
    return _.filter(transactions, (transaction) => transaction.isAnIncome(userId));
  }

  function _thatAreExpenditures (userId, transactions) {
    return _.filter(transactions, (transaction) => transaction.isAnExpenditure(userId));
  }


  /****** Helpers ******/

  function _buildTransaction (transaction) {
    const newTransaction = new Transaction(transaction);

    newTransaction.fetch();

    return newTransaction;
  }
}