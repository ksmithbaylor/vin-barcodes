export const success = body => ({
  statusCode: 200,
  body: JSON.stringify(body)
});

export const failure = err => ({
  statusCode: 500,
  body: JSON.stringify(err.message)
});
