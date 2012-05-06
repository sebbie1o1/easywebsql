EasyWebSql
==========

- Description

Very simple WebSql Wrapper


- HowTo

var db_params = {
  name: 'your db name',
  version: '1.0',
  description: 'some info',
  size: 2*1024*1024
}

var db = EasyWebSql(db_params);

methods:

- db.drop_table(table, callback) // table - table name
- db.count(table, callback) // table - table name
- db.insert(tx, table, values) // table - table name, values - array
- db.create_table(table, fields, callback) // table - table name, fields - array
- db.run_if_empty = function(table, callback_empty, callback_not_empty) // run if table count == 0
- db.json2sql(params) //params: json, table, mapper, callback :: LAME - requires jquery ::
