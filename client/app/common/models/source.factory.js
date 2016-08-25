'use strict';
angular.module('paymentProcessor')
  .factory('Source', source);

const DEFAULT_SOURCE = {
  token: ''
};

function source () {

  // Constructor
  function Source (sourceData) {
    Object.assign(
      this,
      DEFAULT_SOURCE,
      {
        token: sourceData.token
      }
    );
  }

  // Member Functions
  Source.prototype = {
    fetch: function () {

    }
  };

  return Source;
}
