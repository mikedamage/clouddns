import http        from 'q-io/http';
import parseDomain from 'parse-domain';

export var getResponseJSON = function getResponseJSON(request) {
  return http.request(request)
    .get('body')
    .invoke('read')
    .invoke('toString')
    .then(JSON.parse);
};

export var getRootDomain = function getRootDomain(subdomain) {
  let parts = parseDomain(subdomain);

  return `${parts.domain}.${parts.tld}`;
};
