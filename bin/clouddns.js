/* jshint node: true */

'use strict';

var _          = require('lodash');
var fs         = require('q-io/fs');
var path       = require('path');
var http       = require('q-io/http');
var logger     = require('bragi');
var moment     = require('moment');
var CloudDNS   = require(path.join(__dirname, '..', 'index'));
var pkg        = require(path.join(__dirname, '..', 'package.json'));
var argv       = require('yargs')
  .option('k', {
    alias: 'key',
    description: 'CloudFlare API key'
  })
  .option('i', {
    alias: 'ipfile',
    description: 'File used to store last IP address',
    default: path.join(process.env.HOME, '.clouddns-ip')
  })
  .option('t', {
    alias: 'ttl',
    description: 'DNS record TTL',
    default: 300
  })
  .option('l', {
    alias: 'log',
    description: 'Log output to file (use "-" for stdout)',
    default: '-'
  })
  .option('V', {
    alias: 'verbose',
    description: 'Show extra information',
    default: false
  })
  .demand('k')
  .demand(1)
  .help('h')
  .alias('h', 'help')
  .version(function() { return pkg.version; })
  .describe('v', 'Show version information')
  .usage('$0 [options] -k API_KEY domain.com [domain2.com]')
  .argv;

logger.options.groupsEnabled = argv.verbose ? true : [ 'info' ];

if (argv.log === '-') {
  logger.transports.get('console').property('showMeta', false);
} else {
  logger.transports.empty();
  logger.transports.add(new logger.transportClasses.File({
    filename: argv.log,
    format: function(log) {
      var tpl = _.template('[ <%= timestamp %> ][ <%= group %> ] <%= message %>');
      log.timestamp = moment(log.unixTimestamp * 1000).format();
      return tpl(log);
    }
  }));
}

logger.log('info', 'hello');
