const DynamoDbLocal = require('dynamodb-local');

DynamoDbLocal.launch(process.env.DYNAMO_LOCAL_PORT).then(instance => {
  process.on('SIGINT', () => {
    DynamoDbLocal.stopChild(instance);
  });
});
