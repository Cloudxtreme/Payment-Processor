'use strict';

angular.module('paymentProcessor')
  .directive('footer', () => {
    return {
      templateUrl: 'components/footer/footer.html',
      restrict: 'E',
      link: (scope, element) => element.addClass('footer')
    };
  });
