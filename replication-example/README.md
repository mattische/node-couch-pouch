## Enabling support for syncing to a remote CouchDB
Take a look here - https://pouchdb.com/getting-started.html#enabling_cors

A note to the above; if you have created a admin user in CouchDB;

Without password;

```
$ npm install -g add-cors-to-couchdb

$ add-cors-to-couchdb
```


With password;


```
$  npm install -g add-cors-to-couchdb

$ add-cors-to-couchdb -u <username> -p <password>
```

