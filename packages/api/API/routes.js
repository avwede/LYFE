// routes

const express = require('express');
const router = express.Router();
const Schema = reqiure('schema.js');

router.get('/schema', function(req, res){
    Schema.find(function(err, schema){
        res.json(schema);
    });
});

router.get('/schema/:id', function(req, res){
    Schema.findById(req.parans.id, function(err, schema){
        if (!schema){
            res.status(404).send('No result found.');
        } else {
            res.json(schema);
        }
    });
});

router.post('/schema', function(req, res){
    let schema = new Schema(req.body);
    schema.save()
        .then(schema => {
            res.send(schema);
        })
        .catch(function(err){
            res.status(422).send('Schema add failed.');
        });
});

router.patch('/schema/:id', function(req, res){
    Schema.findByIdAndUpdate(req.params.id, req.body)
        .then(function(){
            res.json('Schema updated');
        })
        .catch(function(err){
            res.status(422).send("Schema update failed.");
        });
});

router.delete('/schema/:id', function(req, res){
    Schema.findById(req.params.id, function(err, article){
        if (!schema){
            res.status(404).send('Schema not found');
        } else {
            Schema.findByIdAndRemove(req.params.id)
                .then(function(){res.status(200).json("Schema deleted") })
        }
    }
}