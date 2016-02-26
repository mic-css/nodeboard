process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../../app');
var Task = require('../../models/taskModel');

var should = chai.should();
chai.use(chaiHttp);

describe('Create a task', function(){

  var createdDate;
  var dueDate;
  var newTask = new Task({
    title: 'Feed the dinosaur',
    dueDate: dueDate = new Date(2016, 02, 26),
    importance: 3
  });

  Task.collection.drop();

  afterEach(function (done) {
    Task.collection.drop();
    done();
  });

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
      res.body.SUCCESS.title.should.equal('Feed the dinosaur');
      res.body.SUCCESS.should.have.property('created');
      res.body.SUCCESS.should.have.property('dueDate');
      res.body.SUCCESS.dueDate.should.equal(dueDate.toISOString());
      res.body.SUCCESS.should.have.property('importance');
      res.body.SUCCESS.importance.should.equal(3);
      res.body.SUCCESS.should.have.property('completed');
      res.body.SUCCESS.completed.should.equal(false);
      done();
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
      Tasks.find().count().should.equal(0);
    });
  });
});
