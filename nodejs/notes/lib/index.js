var dynamo = require('./dynamo');
module.exports.respond = function (event, callback) {
  var params = {
    TableName: dynamo.tableName,
  };

  return dynamo.doc.scan(params, function (error, data) {
    if (error) {
      callback(error);
    } else {
      var items = data.Items;
      var newData = { 'notes' : items };

      callback(error, newData);
    }
  });
};
