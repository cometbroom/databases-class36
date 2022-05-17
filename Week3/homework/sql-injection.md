1. Example injection:
A: a way to inject into sql would be to pass `name' or ''='` to the name or code variables. `'' = ''` will be gotten on WHERE condition and
all values will be returned.

2. Rewrite:
```js
function getPopulation(Country, name, code, cb) {
  // assuming that connection to the database is established and stored as conn
  conn.query(
    `SELECT Population FROM ${Country} WHERE Name = ? and code = ?`,
    [name, code],
    function (err, result) {
      if (err) cb(err);
      if (result.length == 0) cb(new Error("Not found"));
      cb(null, result[0].name);
    }
  );
}

```