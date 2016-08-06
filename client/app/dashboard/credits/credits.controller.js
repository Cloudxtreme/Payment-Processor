'use strict';

angular.module('paymentProcessor')
  .controller('CreditsCtrl', creditsCtrl);

function creditsCtrl(creditsManager) {
  /*jshint validthis: true */
  var viewModel = this;

  /** Controller Variables **/
  viewModel.credits = [];

  /** Controller Functions **/
  

  _initController();

  /******** Implementation *******/

  function _initController() {
    creditsManager.getAll().then(function(credits) {
      viewModel.credits = credits;
    });
  }

}
