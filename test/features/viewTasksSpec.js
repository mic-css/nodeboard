process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../../app');
var Task = require('../../models/taskModel');

var should = chai.should();
chai.use(chaiHttp);

describe('Read all tasks', function(){
  var createdDate;
  var dueDate;
  var newTask;

  Task.collection.drop();

  beforeEach(function (done) {
    newTask = new Task({
      title: 'Feed the dinosaur',
      created: createdDate = new Date(),
      dueDate: dueDate = new Date(2016, 02, 26),
      importance: 3
    });
    newTask.save(function (err) {
      done();
    });
  });

  afterEach(function (done) {
    Task.collection.drop();
    done();
  });

  it ('responds with a json including a list of all tasks when there is a GET request to "/tasks"', function(done) {
    chai.request(server)
    .get('/tasks')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.have.property('_id');
      res.body[0].should.have.property('title');
      res.body[0].title.should.equal(newTask.title);
      res.body[0].should.have.property('created');
      res.body[0].created.should.equal(newTask.created.toISOString());
      res.body[0].should.have.property('dueDate');
      res.body[0].dueDate.should.equal(newTask.dueDate.toISOString());
      res.body[0].should.have.property('importance');
      res.body[0].importance.should.equal(newTask.importance);
      res.body[0].should.have.property('completed');
      res.body[0].completed.should.equal(newTask.completed);
      done();
    });
  });
});
