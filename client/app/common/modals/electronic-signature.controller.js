'use strict';

angular.module('paymentProcessor')
  .controller('ElectronicSignatureCtrl', electronicSignatureCtrl);

// TODO: Add spinner while creating signatures

function electronicSignatureCtrl ($modalInstance, allSignaturesObj, userObj, User, electronicSignatureManager) {
  const viewModel = this;

  /** Modal Variables **/
  viewModel.step = 1;
  viewModel.allSignatures = allSignaturesObj;
  viewModel.currentUser = userObj;
  viewModel.allUsers = [];
  viewModel.selectedUser = null;
  viewModel.uploadFile = {};
  viewModel.title = "";

  /** Modal Functions **/
  viewModel.setUploadFile = _setUploadFile;
  viewModel.chooseMe = _chooseMe;
  viewModel.chooseSomeoneElse = _chooseSomeoneElse;
  viewModel.selectedSomeoneElse = _selectedSomeoneElse;

  _initController();

  /****** Implementation ******/

  function _initController () {
    const users = [
      new User({email: 'gabeharms@gmail.com', firstName: 'Gabe', lastName: 'Harms'}),
      new User({email: 'mollyharms@gmail.com', firstName: 'Molly', lastName: 'Harms'})
    ];

    viewModel.allUsers = _.filter(users, (user) => user.email !== viewModel.currentUser.email);
  }

  function _setUploadFile (files) {
    viewModel.uploadFile = files[0];
    viewModel.step = 2;
  }

  function _chooseMe () {
    _createSignatureForSelf();
  }

  function _chooseSomeoneElse () {
    viewModel.step = 3;
  }

  function _selectedSomeoneElse () {
    _createSignatureForOther(viewModel.selectedUser);
  }

  /****** Helpers ******/

  function _createSignatureForSelf () {
    const _getSignUrl = (response) => {
      _getSignatureUrl(response.data.signature_request.signatures[0].signature_id).then(_openHelloSignModal);
    };

    _createSignature(viewModel.currentUser).then(_getSignUrl);
  }

  function _createSignatureForOther (otherUser) {
    _createSignature(otherUser).then(() => closeModal());
  }

  function _createSignature (toUser) {
    return electronicSignatureManager.createSignatureRequest(viewModel.currentUser, toUser, viewModel.title, viewModel.uploadFile);
  }

  function _getSignatureUrl (signatureId) {
    return electronicSignatureManager.getSignatureUrl(signatureId);
  }

  function _openHelloSignModal (signUrl) {
    HelloSign.open({
      url: signUrl,
      allowCancel: true,
      skipDomainVerification: true,
      messageListener: _waitForSignature
    });
  }

  function _waitForSignature (eventData) {
    if (eventData.event === HelloSign.EVENT_SIGNED) {
      closeModal(10000);
    }
  }

  function closeModal (msg) {
    $modalInstance.close(msg);
  }
}
