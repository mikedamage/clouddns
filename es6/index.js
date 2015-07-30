/* jshint node: true, esnext: true */

'use strict';

import _               from 'lodash';
import q               from 'q';
import fs              from 'q-io/fs';
import http            from 'q-io/http';
import moment          from 'moment';
import CloudFlare      from './lib/cloudflare';

import {
  getResponseJSON,
  getRootDomain
} from './lib/utilities';

const jsonipURL = 'http://jsonip.com/';

class CloudDNS {
  constructor(options = {}) {

    this.lastIP  = '';
    this.options = _.assign({ domains: [], ttl: 3e2 }, options);

    if (_.isEmpty(this.options.domains)) {
      throw new Error('options.domains must not be empty');
    }

    if (!this.options.token) {
      throw new Error('options.token is required');
    }

    if (!this.options.email) {
      throw new Error('options.email is required');
    }

    this.rootDomains = _(this.options.domains).map(getRootDomain).uniq().value();
    this.client      = this.options.client || new CloudFlare({
      email: this.options.email,
      token: this.options.token
    });
  }

  get domains() {
    return this.options.domains;
  }

  set domains(domains) {
    if (!_.isArray(domains) || _.isEmpty(domains)) {
      throw new Error('domains must be a non-empty array');
    }

    this.options.domains = domains;
    this.rootDomains     = _(this.options.domains).map(getRootDomain).uniq().value();
  }

  getCurrentIP() {
    return getResponseJSON(jsonipURL);
  }

  getLastIP() {
    return q(this.lastIP);
  }

  needsUpdate() {
    return q.all([
      this.getLastIP(),
      this.getCurrentIP()
    ]).spread((last, current) => last !== current);
  }

  getRecordsForDomain(subdomain) {
    let rootDomain = getRootDomain(subdomain);

    return this.client
      .getZones()
      .then(zones => {
        return _.find(zones.result, zone => zone.name === rootDomain);
      })
      .then(zone => {
        return this.client.getZoneRecords(zone.id);
      });
  }

  update(force = false) {
    return this.needsUpdate().then(needsUpdate => {
      let deferred = q.defer();

      if (!needsUpdate && !force) {
        deferred.resolve(false);
      } else {
        // todo - actually do things to update the IP
      }

      return deferred.promise;
    });
  }
}

export default CloudDNS;
