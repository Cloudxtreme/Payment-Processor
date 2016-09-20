'use strict';

angular.module('paymentProcessor')
  .service('electronicSignatureManager', electronicSignatureManager);

function electronicSignatureManager ($q, $http, loginManager, HELLO_SIGN_API_CLIENT_ID, HELLO_SIGN_API_KEY_BASE_64) {
	const service = this;

	/** Service Variables **/

	/** Service Functions **/
  service.getSignatureUrl = _getSignatureUrl;
  service.getSignatureRequests = _getSignatureRequests;

	/****** Implementation ******/

  function _getSignatureUrl (file) {
    const deferred = $q.defer();

    $http({
      url: `https://${HELLO_SIGN_API_KEY_BASE_64}:@api.hellosign.com/v3/signature_request/create_embedded`,
      method: "POST",
      params: _createEmbeddedParams(file)
    }).success(({signatures: {signature_id}}) => {
      $http({
        url: `https://${HELLO_SIGN_API_KEY_BASE_64}:@api.hellosign.com/v3/embedded/sign_url/${signature_id}`,
          method: "GET"
      }).success(({embedded: {sign_url}}) => {
        deferred.resolve({sign_url: sign_url});
      })
      .error((data, status) => deferred.reject(status));
    })
    .error((data, status) => deferred.reject(status));

    return deferred.promise;
  }

  function _getSignatureRequests () {
    const deferred = $q.defer();
    loginManager.getUser().then((user) => {
      $http({
        url: `https://api.hellosign.com/v3/signature_request/list?query=from:${user.email}`,
          method: "GET",
          headers: {'Authorization': `Basic ${HELLO_SIGN_API_KEY_BASE_64}`}
      }).success(({signature_requests}) => {
        deferred.resolve(signature_requests);
      })
      .error((data, status) => deferred.reject(status));
    });

    return deferred.promise;
  }

  /****** Helpers ******/

  function _createEmbeddedParams (file) {
    return {
      client_id: HELLO_SIGN_API_CLIENT_ID,
      subject: "Testin this out for now",
      message: "Does this work?",
      signers: [
        {
          email_address: 'gabeharms@gmail.com',
          name: 'gabe'
        }
      ],
      file: [file],
      test_mode: 1
    };
  }

  function _notUsedYet () {
    const _openHelloSignModal = () => {
      HelloSign.open({
        url: "https://www.hellosign.com/editor/embeddedSign?signature_id=11fcab576e48516a9a8690bfb2f0af46&token=b90e728ef367c27650e31f041996dca4",
        allowCancel: true,
        skipDomainVerification: true,
        messageListener: function () {
          console.log("HelloSign event received");
        }
      });
    };

    electronicSignatureManager.getSignatureUrl().then(_openHelloSignModal);
  }
}
