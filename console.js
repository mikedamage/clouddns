var ld         = require('lodash');
var http       = require('q-io/http');
var fs         = require('q-io/fs');
var CloudFlare = require('./lib/cloudflare');

var auth, cf;

fs.exists('auth.json').then(function(exists) {
  if (exists) {
    return fs.read('auth.json');
  }
  throw new Error('auth.json not found');
}).fail(function(err) {
  console.log(err);
}).invoke('toString').then(JSON.parse).then(function(json) {
  auth = json;
  cf   = new CloudFlare(auth);
});
