var dynamo = require('./dynamo');

module.exports.respond = function (event, callback) {
  var params = {
    TableName: dynamo.tableName,
    Key: {
      id: event.id
    }
  };

  return dynamo.doc.get(params, function (error, data) {
    if (error) {
      callback(error);
    } else {
      var item = data.Item;
      var newData = { 'note' : item };

      callback(error, newData);
    }
  });
};
