var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Dishes = require('../models/dishes.js');

var dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
// .all(function(req, res, next) {
//   res.writeHead(200, {
//     'ContentType': 'text/plain'
//   });
//   next();
// })

.get(function(req, res, next) {
  // res.end('Will send all dishes');
  Dishes.find({}, function(err, dishes) {
    if (err) throw err;
    // res.json() method automatically handle the HTTP status code and ContentType set to application/json
    res.json(dishes); 
  })
})

.post(function(req, res, next) {
  // res.end('Add dish: ' + req.body.name + ' with detail ' + req.body.description);
  Dishes.create(req.body, function(err, dish) {
    if(err) throw err;

    console.log('Dish created!');
    var id = dish._id;
    res.writeHead(200, {
      'ContentType': 'text/plain'
    })
    res.end('Added the dish with id: ' + id);
  });
})

.delete(function(req, res, next) {
  // res.end('Deleting all dishes');
  Dishes.remove({}, function(err, resp) {
    if (err) throw err;
    // response how many dishes removed
    res.json(resp);
  });
});

dishRouter.route('/:id')
// .all(function(req, res, next) {
//   res.writeHead(200, {
//     'ContentType': 'text/plain'
//   });
//   next();
// })

.get(function(req, res, next) {
  // res.end('get dish: ' + req.params.id);
  Dishes.findById(req.params.id, function(err, dish) {
    if (err) throw err;
    res.json(dish);
  });
})

.put(function(req, res, next) {
  // res.write('Updating dish ' + req.params.id + '\n');
  // res.end('Updating dish ' + req.body.name + ' with detail ' + req.body.description);
  Dishes.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, {
    new: true
  }, function(err, dish) {
    if (err) throw err;
    res.json(dish);
  });
})

.delete(function(req, res, next) {
  // res.end('Deleting dish ' + req.params.id);
  Dishes.findByIdAndRemove(req.params.id, function(err, resp) {
    if (err) throw err;
    res.json(resp);
  });
});

dishRouter.route('/:id/comments')
.get(function(req, res, next) {
  Dishes.findById(req.params.id, function(err, dish) {
    if (err) throw err;
    res.json(dish.comments);
  });
})

.post(function(req, res, next) {
  Dishes.findById(req.params.id, function(err, dish) {
    if (err) throw err;
    dish.comments.push(req.body);
    dish.save(function(err, dish) {
      if (err) throw err;
      console.log('Updated Comments');
      res.json(dish);
    })
  })
})

.delete(function(req, res, next) {
  Dishes.findById(req.params.id, function(err, dish) {
    if (err) throw err;

    dish.comments = [];
    dish.save(function(err, dish) {
      if (err) throw err;
      console.log('Deleted all Comments');
      res.writeHead(200, {
        'ContentType': 'text/plain'
      });
      res.end('Deleted all Comments');
    });
  });
});

dishRouter.route('/:dishId/comments/:commentId')
.get(function(req, res, next) {
  Dishes.findById(req.params.dishId, function(err, dish) {
    if (err) throw err;
    res.json(dish.comments.id(req.params.commentId));
  });
})

.put(function(req, res, next) {
  Dishes.findById(req.params.dishId, function(err, dish) {
    if (err) throw err;
    dish.comments.id(req.params.commentId).remove();
    dish.comments.push(req.body);
    dish.save(function(err, dish) {
      if (err) throw err;
      console.log('Updated comment');
      res.json(dish);
    });
  });
})

.delete(function(req, res, next) {
  Dishes.findById(req.params.dishId, function(err, dish) {
    if (err) throw err;
    dish.comments.id(req.params.commentId).remove();
    dish.save(function(err, resp) {
      if (err) throw err;
      console.log('Deleted comment');
      res.json(resp);
    });
  });
});

module.exports = dishRouter;