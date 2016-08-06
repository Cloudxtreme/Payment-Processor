'use strict';

angular.module('paymentProcessor')
  .service('creditsManager', creditsManager);

function creditsManager($q, $http, loginManager) {
	/*jshint validthis: true */
	var service = this;


	/** Service Variables **/


	/** Service Functions **/
  service.getAll = _getAll;


	/****** Implementation ******/

  function _getAll() {
    var deferred = $q.defer();

    $http.get('api/credits', {headers: {'X-Auth': loginManager.getToken()}})
      .success(function(credits) {
        deferred.resolve(credits);
      })
      .error(function(status) {
        deferred.reject(status);
      });

    return deferred.promise;
  }

}
