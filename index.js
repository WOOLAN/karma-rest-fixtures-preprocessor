var RestFixtures = (function() {
  'use strict';

  var util = require('util');
  var TEMPLATE = 'try { __RESTFIXTURES__.push(%s) } catch(e) { var __RESTFIXTURES__ = []; __RESTFIXTURES__.push(%s) }';

  function restFixturesPreprocessor(logger, config) {
    config = config || {
      basePath: '/',
      restPath: '/'
    };
    var log = logger.create('preprocessor.rest-fixtures');

    return function(content, file, done) {
      log.debug('Processing \"%s\".', file.originalPath);

      var index = file.path.indexOf(config.basePath);
      var path = file.path.substr(index + config.basePath.length).replace(/\.json$/i, '').replace(/\./g, '/');
      var method = path.indexOf('-') >= 0 ? path.substr(path.indexOf('-') + 1) : 'GET'; // If no method is specified, default to GET.
      path = path.indexOf('-') >= 0 ? path.substr(0, path.indexOf('-')) : path;

      // Files starting with double underscores are root endpoints, so strip the filename from the path.
      var rootIndex = path.indexOf('__');
      if (rootIndex >= 0) {
        path = path.substr(0, rootIndex - 1);
      }

      var fixture = JSON.stringify({
        method: method.toUpperCase(),
        url: config.restPath + path,
        response: JSON.parse(content),
      });

      file.path += '.js';
      done(util.format(TEMPLATE, fixture, fixture));
    }
  }

  restFixturesPreprocessor.$inject = ['logger', 'config.restFixturesPreprocessor'];

  return restFixturesPreprocessor;
})();

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:rest-fixtures': ['factory', RestFixtures],
};