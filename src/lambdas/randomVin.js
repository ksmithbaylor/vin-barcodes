import 'isomorphic-fetch';
import { success, failure } from '../lambda-helpers';

const getVin = type =>
  fetch(`http://randomvin.com/getvin.php?type=${type}`).then(res => res.text());

export async function handler(event) {
  try {
    const vin = await getVin(event.queryStringParameters.type);
    return success({ vin });
  } catch (err) {
    return failure(err);
  }
}
