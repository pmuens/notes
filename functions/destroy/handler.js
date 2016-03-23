'use strict';

var lib = require('../lib/destroy');

module.exports.handler = function(event, context) {
  lib.respond(event, function(error, response) {
    return context.done(error, response);
  });
};
