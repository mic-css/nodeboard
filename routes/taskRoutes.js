var express = require('express');
var router = express.Router();
var Task = require('../models/taskModel');

// Router is mounted on '/tasks' path in app.js
router.route('/')
.get(function (req, res) {
  Task.find(function (err, tasks) {
    if (err) {
      res.json({'ERROR': err});
    } else {
      res.json(tasks);
    }
  });
})
.post(function (req, res) {
  var newTask = new Task({
    title: req.body.title,
    dueDate: req.body.dueDate,
    importance: req.body.importance,
    completed: req.body.completed
  });

  newTask.save(function (err) {
    if (err) {
      res.status(400).json({'ERROR': err});
    } else {
      res.status(201).json({'SUCCESS': newTask});
    }
  });
});

router.route('/:id')
.put(function (req, res) {
  req.body.updated = new Date();
  Task.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, task) {
    if (err) {
      res.status(400).json({'ERROR': err});
    } else {
      res.status(201).json({'UPDATED': task});
    }
  });
});

module.exports = router;
