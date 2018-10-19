import dynamoose from 'dynamoose';

// Dynamo setup and queries

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
