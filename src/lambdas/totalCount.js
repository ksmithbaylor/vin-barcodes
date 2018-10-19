import { countVINs, success, failure } from '../lambda-helpers';

export async function handler(event) {
  try {
    const total = await countVINs();
    return success({ total });
  } catch (err) {
    return failure(err);
  }
}
