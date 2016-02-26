process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../../app');
var Task = require('../../models/taskModel');

var should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

describe('Create a task', function () {
  var newTask;

  Task.collection.drop();

  afterEach(function (done) {
    Task.collection.drop();
    done();
  });

  beforeEach(function (done) {
    newTask = new Task({
       title: 'Feed the dinosaur',
       dueDate: new Date(2016, 02, 26),
       importance: 3
     });
     done();
  });

  describe('if given a valid task', function(){
    it('returns a success message with the posted object', function (done) {
      chai.request(server)
      .post('/tasks')
      .send(newTask)
      .end(function(err, res){
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('SUCCESS');
        res.body.SUCCESS.should.be.a('object');
        res.body.SUCCESS.should.have.property('_id');
        res.body.SUCCESS.should.have.property('title');
        res.body.SUCCESS.title.should.equal(newTask.title);
        res.body.SUCCESS.should.have.property('created');
        res.body.SUCCESS.should.have.property('dueDate');
        res.body.SUCCESS.dueDate.should.equal(newTask.dueDate.toISOString());
        res.body.SUCCESS.should.have.property('importance');
        res.body.SUCCESS.importance.should.equal(newTask.importance);
        res.body.SUCCESS.should.have.property('completed');
        res.body.SUCCESS.completed.should.equal(newTask.completed);
        done();
      });
    });

    it('writes the object to the db', function (done) {
      chai.request(server)
      .post('/tasks')
      .send(newTask)
      .end(function (err, res) {
        Task.count(function (err, count) {
          count.should.equal(1);
        });
        Task.find(function (err, tasks) {
          tasks[0].title.should.equal(newTask.title);
        });
        done();
      });
    });
  });

  describe('if given an invalid request', function () {
    var invalidTask = {
      'invalid': 'true'
    };

    it('returns a 400 error', function (done) {
      chai.request(server)
      .post('/tasks')
      .send(invalidTask)
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.have.property('ERROR');
        done();
      });
    });

    it('does not write the object to the db', function (done) {
      chai.request(server)
      .post('/tasks')
      .send(invalidTask);
      Task.count(function (err, count) {
        count.should.equal(0);
        done();
      });
    });
  });
});
