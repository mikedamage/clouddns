import http from 'q-io/http';

export default function getResponseJSON(request) {
  return http.request(request)
    .get('body')
    .invoke('read')
    .invoke('toString')
    .then(JSON.parse);
};
