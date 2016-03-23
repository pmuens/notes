var dynamo = require('./dynamo');

module.exports.respond = function (event, callback) {
  var params = {
    TableName : dynamo.tableName,
    Key: {
      id: event.id
    }
  };

  return dynamo.doc.delete(params, callback);
};
