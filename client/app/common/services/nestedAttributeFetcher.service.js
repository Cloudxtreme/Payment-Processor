'use strict';

angular.module('paymentProcessor')
  .service('nestedAttributeFetcher', nestedAttributeFetcher);

function nestedAttributeFetcher ($q, $http, loginManager, Fetch) {
	const service = this;

	/** Service Variables **/

	/** Service Functions **/
  service.fetch = _fetch;


	/****** Implementation ******/

  function _fetch (obj, attribute) {
    const deferred = $q.defer();
    const value = _getAttributeValue();

    if (_isFetchType(value)) {
      $http.get(value.url, {headers: {'X-Auth': loginManager.getToken()}})
      .success(data => {
        const newAttribute = new value.class(data);

        obj[attribute] = newAttribute;
        deferred.resolve(newAttribute);
      })
      .error(status => deferred.reject(status));
    } else {
      deferred.resolve(value);
    }

    return deferred.promise;
  }

  function _isFetchType (value) {
    return value instanceof Fetch;
  }

  function _getAttributeValue (obj, attribute) {
    try {
      return obj[attribute]();
    } catch (error) {
      return obj[attribute];
    }
  }
}
