import dynamoose from 'dynamoose';

// Dynamo setup and queries

dynamoose.AWS.config.update({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

if (process.env.LOCAL) {
  dynamoose.local(`http://localhost:${process.env.DYNAMO_LOCAL_PORT}`);
}

export const VIN = dynamoose.model('VINs', { value: String });
export const saveVIN = value => new VIN({ value }).save();
export const countVINs = () =>
  VIN.scan()
    .count()
    .exec()
    .then(counts => counts[0]);

// Lambda return helpers

export const success = body => ({
  statusCode: 200,
  body: JSON.stringify(body)
});

export const failure = err => ({
  statusCode: 500,
  body: JSON.stringify(err.message)
});
