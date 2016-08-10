'use strict';

angular.module('paymentProcessor')
  .service('loginManager', loginManager);

function loginManager($q, $http, $state, User) {
	/*jshint validthis: true */
	var service = this;


	/** Service Variables **/
	service._token = '';

	/** Service Functions **/
	service.login = _login;
	service.logout = _logout;
	service.getUser = _getUser;
	service.getToken = _getToken;
  service.isLoggedIn = _isLoggedIn;
  service.redirectIfNotLoggedIn = _redirectIfNotLoggedIn;


	/****** Implementation ******/

	function _getUser() {
		var deferred = $q.defer();

    if (service._user) {
      deferred.resolve(service._user);
    } else {
		  $http.get('api/user', {headers: {'X-Auth': service._token}})
			  .success(function(user) {
          service._user = new User(user);
				  deferred.resolve(service._user);
			  })
			  .error(function(data, status) {
				  deferred.reject(status);
			  });
    }

		return deferred.promise;
	}

	function _login(username, password) {
		var deferred = $q.defer();

		$http.post('api/login', {email: username, password: password})
			.success(function(data) {
				service._token = data.token;
				deferred.resolve(data.token);
			})
			.error(function(data, status) {
				deferred.reject(status);
			});

		return deferred.promise;
	}

	function _logout() {
		service._token = '';
	}

	function _getToken() {
		return service._token;
	}

  function _isLoggedIn() {
    return service._token !== null && service._token !== '';
  }

  function _redirectIfNotLoggedIn() {
    if (!service.isLoggedIn()) {
      $state.go('login');
    }
  }


}
