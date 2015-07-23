#!/usr/bin/env node

/* jshint node: true, esnext: true */

'use strict';

import _        from 'lodash';
import path     from 'path';
import logger   from 'bragi';
import moment   from 'moment';
import CloudDNS from '../index';
import pkg      from '../../package.json';
import yargs    from 'yargs';

let argv = yargs
  .wrap(80)
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
    format: log => {
      let tpl       = _.template('[ <%= timestamp %> ][ <%= group %> ] <%= message %>');
      log.timestamp = moment(log.unixTimestamp * 1000).format();
      return tpl(log);
    }
  }));
}

logger.log('info', 'hello');
