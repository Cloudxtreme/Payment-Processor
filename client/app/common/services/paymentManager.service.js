'use strict';

angular.module('paymentProcessor')
  .service('paymentManager', paymentManager);

function transactionsManager ($q, $http, loginManager, Source) {
	const service = this;

	/** Service Variables **/

	/** Service Functions **/
  service.getExistingSources = _getExistingSources; 
  service.saveNewSource = _saveNewSource; 

	/****** Implementation ******/

  function _getExistingSources(stripeInfo) {
    const deferred = $q.defer();

    /* TODO: Figure out how to get sources from Stripe API and unstub source
    $http.get('api/transactions', {headers: {'X-Auth': loginManager.getToken()}})
      .success(transactions => {
        service.transactions = _.map(transactions, (transaction) => _buildTransaction(transaction));
        deferred.resolve(service.transactions);
      })
      .error(status => deferred.reject(status));
    */
    const source = new Source({});
    deferred.resolve([source]);  // bad umm kayy  
    
    return deferred.promise;
  }

  function _saveNewSource(source) {
    const deferred = $q.defer();
 
    /* TODO: Figure out how to save new payment sources from Stripe API 
    $http.get('api/transactions', {headers: {'X-Auth': loginManager.getToken()}})
      .success(transactions => {
        service.transactions = _.map(transactions, (transaction) => _buildTransaction(transaction));
        deferred.resolve(service.transactions);
      })
      .error(status => deferred.reject(status));
    */

    deferred.resolve(new Source({}));
    return deferred.promise;
  }
}
 
