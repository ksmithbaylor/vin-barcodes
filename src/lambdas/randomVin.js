import 'isomorphic-fetch';

export function handler(event, context, callback) {
  const { type } = event.queryStringParameters;

  fetch(`http://randomvin.com/getvin.php?type=${type}`)
    .then(response => response.text())
    .then(vin => {
      callback(null, {
        statusCode: 200,
        body: vin
      });
    })
    .catch(err => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          error: 'something went wrong'
        })
      });
    });
}
