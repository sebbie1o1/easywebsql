/**
  EasyWebSql

  @param name
  @param version
  @param description
  @param size
*/
var EasyWebSql = function(params) {
  var name = params.name || 'websqldb';
  var version = params.version || '1.0';
  var description = params.description || 'default';
  var size = params.size || (2 * 1024 * 1024);
  
  var db = openDatabase(name, version, description, size);
  
  if (!db) {
    return null;
  }

  db.sql = function(sql, callback) {
    var callback = callback || function() {};
    this.transaction(function (tx) {
      tx.executeSql(sql, [],

      function(tx, results) {
        callback(results);
      }, 

      function(tx, results) { 
        console.log(results);
      });

    });
  };

  db.drop_table = function(table, callback) {
    this.sql('DROP TABLE ' + table, callback);
  };

  db.count = function(table, callback) {
    this.sql('SELECT count(*) as c FROM ' + table, function(res) {
      callback(res.rows.item(0).c);
    });
  };

  db.insert = function(tx, table, values) {
    var sql_string = 'INSERT INTO ' + table + ' VALUES (' + Array(values.length).join('?,') + '?)';
    tx.executeSql(sql_string, values, 

    function(tx, res) {
      // success callback
    },

    function(tx, err) {
      var x = table;
      var y = values;
      console.log('Error');
      console.log(err);
    }

    );
  };

  db.create_table = function(table, fields, callback) {
    this.sql('CREATE TABLE IF NOT EXISTS ' + table + '(' + fields.join() + ')', callback);
  };

  db.run_if_empty = function(table, callback_empty, callback_not_empty) {
    db.count(table, function(count) {
      if (count > 0) {
        callback_not_empty(count);
      } else {
        callback_empty();
      }
    });
  };

  //params: json, table, mapper, callback
  //lame - requires jquery
  db.json2sql = function(params) {

    (function(that) {
      $.getJSON(params.json, function(elements) {
        that.transaction(function (tx) {
          for (var i=0; i<elements.length; i++) {
            var el = params.mapper(elements[i]);
            db.insert(tx, params.table, el);
          }
          params.callback(elements);
        });
      });
    })(this);

  };
  
  return db;
};
