/* jshint node: true */

'use strict';

var _          = require('lodash');
var Q          = require('q');
var fs         = require('q-io/fs');
var http       = require('q-io/http');
var cloudflare = require('cloudflare');
var moment     = require('moment');

var jsonipURL = 'http://jsonip.com/';
var defaults  = {
  ipFile: path.join(process.env.HOME, '.clouddns-ip'),
  domains: [],
  ttl: 3e2
};

var CloudDNS = function CloudDNS(options) {
  this.options    = _.assign(defaults, options);
  this.cloudflare = cloudflare.createClient({
    email: this.options.email,
    token: this.options.token
  });
};

CloudDNS.prototype.getCurrentIP = function() {
  return http.request(jsonipURL)
    .get('body')
    .invoke('read')
    .invoke('toString')
    .then(JSON.parse)
    .get('ip');
};

CloudDNS.prototype.getLastIP = function() {
  var ipFile = this.options.ipFile;

  return fs.exists(ipFile).then(function(exists) {
    if (exists) {
      return fs.read(ipFile);
    }
    return '';
  });
};

CloudDNS.prototype.needsUpdate = function() {
  return Q.all([
    this.getLastIP(),
    this.getCurrentIP()
  ]).spread(function(last, current) {
    return last !== current;
  });
};

CloudDNS.prototype.update = function(force) {
  force    = !!force;
  var self = this;

  return this.needsUpdate().then(function(needsUpdate) {
    var deferred = Q.defer();

    if (!needsUpdate && !force) {
      return deferred.resolve(false);
    }

    // [todo] - Actually update DNS records on cloudflare
  });
};
