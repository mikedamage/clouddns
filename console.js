var ld         = require('lodash');
var http       = require('q-io/http');
var fs         = require('q-io/fs');
var CloudFlare = require('./lib/cloudflare');

var auth;

fs.read('auth.json').invoke('toString').then(JSON.parse).then(function(json) { auth = json; });
