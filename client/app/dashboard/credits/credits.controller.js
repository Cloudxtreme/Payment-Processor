'use strict';

angular.module('paymentProcessor')
  .controller('CreditsCtrl', creditsCtrl);

function creditsCtrl (creditsManager) {
  const viewModel = this;

  /** Controller Variables **/
  viewModel.credits = [];

  /** Controller Functions **/

  _initController();

  /******** Implementation *******/

  function _initController () {
    creditsManager.getAll().then(credits => viewModel.credits = credits);
  }
}
