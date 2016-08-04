'use strict';

angular.module('paymentProcessor')
  .service('loginManager', loginManager);

function loginManager($q, $http, $state) {
	/*jshint validthis: true */
	var service = this;


	/** Service Variables **/
	service.token = '';

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

		$http.get('api/user', {headers: {'X-Auth': service.token}})
			.success(function(user) {
				deferred.resolve(user);
			})
			.error(function(data, status) {
				deferred.reject(status);
			});

		return deferred.promise;
	}

	function _login(username, password) {
		var deferred = $q.defer();

		$http.post('api/login', {username: username, password: password})
			.success(function(token) {
				service.token = token;
				deferred.resolve(token);
			})
			.error(function(data, status) {
				deferred.reject(status);
			});

		return deferred.promise;
	}

	function _logout() {
		service.token = '';
	}

	function _getToken() {
		return service.token;
	}

  function _isLoggedIn() {
    return service.token !== null && service.token !== '';
  }

  function _redirectIfNotLoggedIn() {
    if (!service.isLoggedIn()) {
      $state.go('login');
    }
  }


}
