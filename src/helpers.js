import 'isomorphic-fetch';

export const fetchVin = type =>
  fetch(`/.netlify/functions/randomVin?type=${type}`)
    .then(res => res.json())
    .then(({ vin }) => vin);

export const vinFromPath = (path = window.location.pathname) =>
  path.split('/').slice(-1)[0] || null;
