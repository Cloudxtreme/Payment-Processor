'use strict';
angular.module('paymentProcessor')
  .factory('Source', source);

const DEFAULT_SOURCE = {
  // TODO: Some attrs  
};

function source () {

  // Constructor
  function Source (sourceData) {
    Object.assign(
      this,
      DEFAULT_SOURCE,
      {
        // some attrs   
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
