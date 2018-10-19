import 'isomorphic-fetch';
import { saveVIN, countVINs, success, failure } from '../lambda-helpers';

const getVin = type =>
  fetch(`http://randomvin.com/getvin.php?type=${type}`).then(res => res.text());

export async function handler(event) {
  try {
    const vin = await getVin(event.queryStringParameters.type);
    await saveVIN(vin);
    const total = await countVINs();
    return success({ vin, total });
  } catch (err) {
    return failure(err);
  }
}
