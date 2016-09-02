'use strict';

angular.module('paymentProcessor')
  .service('transactionsManager', transactionsManager);

function transactionsManager ($q, $http, loginManager, Transaction, Destination) {
	const service = this;

	/** Service Variables **/
  service.transactions = null;

	/** Service Functions **/
  service.getAll = _getAll;
  service.update = _update;
  service.getDestination = _getDestination;
  service.thatAreIncomes = _thatAreIncomes;
  service.thatAreExpenditures = _thatAreExpenditures;
  service.flush = _flush;


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

  function _update (transaction) {
    const deferred = $q.defer();

    $http({
      url: `api/transactions/${transaction.id}`,
      method: "PUT",
      data: transaction.forServer(),
      headers: {'X-Auth': loginManager.getToken()}
    }).success(transactionData => {
        const updatedTransaction = new Transaction(transactionData);
        const index = _.indexOf(service.transactions, _.find(service.transactions, {id: 1}));

        service.transactions[index] = updatedTransaction;
        deferred.resolve(updatedTransaction);
      })
      .error(status => deferred.reject(status));

    return deferred.promise;
  }


  function _getDestination (transaction) {
    const deferred = $q.defer();

    $http.get(`api/transactions/${transaction.id}/destination`, {headers: {'X-Auth': loginManager.getToken()}})
      .success(destinationData => {
        const destination = new Destination({accountId: destinationData.destination_id});

        deferred.resolve(destination);
      })
      .error(status => deferred.reject(status));

    return deferred.promise;
  }

  function _thatAreIncomes (userId, transactions) {
    return _.filter(transactions, (transaction) => transaction.isAnIncome(userId));
  }

  function _thatAreExpenditures (userId, transactions) {
    return _.filter(transactions, (transaction) => transaction.isAnExpenditure(userId));
  }

  function _flush () {
    service.transactions = null;
  }

  /****** Helpers ******/

  function _buildTransaction (transaction) {
    const newTransaction = new Transaction(transaction);

    newTransaction.fetch();

    return newTransaction;
  }
}
