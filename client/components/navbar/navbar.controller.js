'use strict';

function navbarController() {
  //start-non-standard
  var menu = [{
    'title': 'Home',
    'state': 'main'
  }];

  var isCollapsed = true;
  //end-non-standard

}

angular.module('paymentProcessor')
  .controller('NavbarController', navbarController);
