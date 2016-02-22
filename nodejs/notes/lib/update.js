var dynamo = require('./dynamo');

module.exports.respond = function (event, callback) {
  var data = event.note;
  data.id = event.id;
  data.updatedAt = new Date().getTime();

  var params = {
    TableName : dynamo.tableName,
    Item: data
  };

  return dynamo.doc.put(params, function (error, data) {
    if (error) {
      callback(error);
    } else {
      callback(error, params.Item);
    }
  });
};
