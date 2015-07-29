import _           from 'lodash';
import http        from 'q-io/http';
import parseDomain from 'parse-domain';

export var getResponseJSON = function getResponseJSON(request, client = http) {
  return client.request(request)
    .get('body')
    .invoke('read')
    .invoke('toString')
    .then(JSON.parse);
};

export var getRootDomain = function getRootDomain(subdomain) {
  let parts = parseDomain(subdomain);

  if (_.isObject(parts)) {
    return `${parts.domain}.${parts.tld}`;
  }

  return parts;
};
