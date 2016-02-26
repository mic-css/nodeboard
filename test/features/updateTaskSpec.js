process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../../app');
var Task = require('../../models/taskModel');

var should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

describe('Update a task', function () {
  var newTask;

  Task.collection.drop();

  beforeEach(function (done) {
    newTask = new Task({
      title: 'Feed the dinosaur',
      dueDate: new Date(2016, 02, 26),
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

  it('returns a success message with the updated object', function (done) {
    chai.request(server)
    .get('/tasks')
    .end(function (err, res) {
      chai.request(server)
      .put('/tasks/'+res.body[0]._id)
      .send({'completed': 'true'})
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('UPDATED');
        res.body.UPDATED.completed.should.equal(true);
        done();
      });
    });
  });

  describe('if passed an invalid request', function () {
    var invalidUpdate = {
      'importance': 'invalid'
    };

    it('returns a 400 error', function (done) {
      chai.request(server)
      .get('/tasks')
      .end(function (err, res) {
        chai.request(server)
        .put('/tasks/'+res.body[0]._id)
        .send(invalidUpdate)
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('ERROR');
          done();
        });
      });
    });
  });
});
