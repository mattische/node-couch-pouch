var Express = require("express");
var BodyParser = require("body-parser");
var PouchDB = require("pouchdb");

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//To be used with local CouchDB
//be sure to add the sync-gateway-config-json file
//The name of the database will be example
var database = new PouchDB("http://127.0.0.1:5984/example"); 

//GET ALL DOCS
app.get("/people", function(req, res) {
    database.allDocs({include_docs: true}).then(function(result) {
        res.send(result.rows.map(function(item) {
            return item.doc;
        }));
    }, function(error) {
        res.status(400).send(error);
    });
});

//GET SPECIFIC DOC
app.get("/people/:id", function(req, res) {
    if(!req.params.id) {
        return res.status(400).send({"status": "error", "message": "An `id` is required"});
    }
    database.get(req.params.id).then(function(result) {
        res.send(result);
    }, function(error) {
        res.status(400).send(error);
    });
});

//UPDATE A DOC
app.put("/people/:id", function(req, res) {
    if(!req.params.id) {
        return res.status(400).send({"status": "error", "message": "An `id` is required"});
    }
    else if(!req.body.firstname) {
        return res.status(400).send({"status": "error", "message": "A `firstname` is required"});
    } else if(!req.body.lastname) {
        return res.status(400).send({"status": "error", "message": "A `lastname` is required"});
    }
    database.get(req.params.id).then(function(result) {
        result.firstname = req.body.firstname;//change firstname and lastname
        result.lastname = req.body.lastname;
        database.put(result);//update the doc in db
        res.send(result);

    }, function(error) {
        res.status(400).send(error);
    });
});

//ADD A DOC
app.post("/people", function(req, res) {
    if(!req.body.firstname) {
        return res.status(400).send({"status": "error", "message": "A `firstname` is required"});
    } else if(!req.body.lastname) {
        return res.status(400).send({"status": "error", "message": "A `lastname` is required"});
    }
    database.post(req.body).then(function(result) {
        res.send(result);
    }, function(error) {
        res.status(400).send(error);
    });
});

//DELETE A DOC
app.delete("/people", function(req, res) {
    if(!req.body.id) {
        return res.status(400).send({"status": "error", "message": "An `id` is required"});
    }
    database.get(req.body.id).then(function(result) {
        return database.remove(result);
    }).then(function(result) {
        res.send(result);
    }, function(error) {
        res.status(400).send(error);
    });
});

var server = app.listen(3000, function() {
    database.info().then(function(info) {
        console.log(info);
        console.log("Listening on port %s...", server.address().port);
    });
});