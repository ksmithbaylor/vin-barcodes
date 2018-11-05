import 'isomorphic-fetch';

const getVin = type =>
  fetch(`http://randomvin.com/getvin.php?type=${type}`).then(res => res.text());

export async function handler(event) {
  try {
    const vin = await getVin(event.queryStringParameters.type);
    return {
      statusCode: 200,
      body: JSON.stringify({ vin })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    };
  }
}
