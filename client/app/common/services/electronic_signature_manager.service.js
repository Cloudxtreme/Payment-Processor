'use strict';

angular.module('paymentProcessor')
  .service('electronicSignatureManager', electronicSignatureManager);

function electronicSignatureManager ($q, $http, loginManager, Upload, HELLO_SIGN_API_CLIENT_ID, HELLO_SIGN_API_KEY_BASE_64) {
	const service = this;

	/** Service Variables **/

	/** Service Functions **/
  service.createSignatureRequest = _createSignatureRequest;
  service.getSignatureUrl = _getSignatureUrl;
  service.getSignatureRequests = _getSignatureRequests;
  service.getSignedFile = _getSignedFile;


	/****** Implementation ******/

  function _createSignatureRequest (fromUser, toUser, title, file) {
    return Upload.upload({
      url: 'https://api.hellosign.com/v3/signature_request/create_embedded',
      method: "POST",
      headers: {
        'Authorization': `Basic ${HELLO_SIGN_API_KEY_BASE_64}`
      },
      data: _createSignatureRequestParams(fromUser, toUser, title, file)
    });
  }

  function _getSignatureUrl (signatureId) {
    const deferred = $q.defer();

    $http({
      url: `https://api.hellosign.com/v3/embedded/sign_url/${signatureId}`,
      method: "GET",
      headers: {
        'Authorization': `Basic ${HELLO_SIGN_API_KEY_BASE_64}`
      }
    }).success(({embedded: {sign_url}}) => {
      deferred.resolve(sign_url);
    })
    .error((data, status) => deferred.reject(status));

    return deferred.promise;
  }

  function _getSignatureRequests () {
    const deferred = $q.defer();

    $http({
      url: `https://api.hellosign.com/v3/signature_request/list`,
      method: "GET",
      headers: {'Authorization': `Basic ${HELLO_SIGN_API_KEY_BASE_64}`}
    }).success(({signature_requests}) => {
      deferred.resolve(signature_requests);
    })
    .error((data, status) => deferred.reject(status));

    return deferred.promise;
  }


  function _getSignedFile (fileUrl) {
    const deferred = $q.defer();

    $http({
      url: fileUrl,
      method: "GET",
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Basic ${HELLO_SIGN_API_KEY_BASE_64}`
      }
    }).success((file) => {
      deferred.resolve(file);
    })
    .error((data, status) => deferred.reject(status));

    return deferred.promise;
  }


   /****** Helpers ******/

  function _createSignatureRequestParams (fromUser, toUser, title, file) {
    return {
      client_id: HELLO_SIGN_API_CLIENT_ID,
      title: title,
      subject: "Testin this out for now",
      message: "Does this work?",
      signers: [
        {
          email_address: toUser.email,
          name: toUser.fullName()
        }
      ],
      metadata: {
        from: fromUser.email
      },
      file: file,
      test_mode: 1
    };
  }
}
