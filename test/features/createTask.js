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
    created: createdDate = new Date(),
    dueDate: dueDate = new Date(2016, 02, 26),
    importance: 3
  });
  Task.collection.drop();

  it('respond with json', function (done) {
    chai.request(server)
    .post('/tasks')
    .send(newTask)
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('SUCCESS');
      res.body.SUCCESS.should.be.a('object');
      res.body.SUCCESS.should.have.property('_id');
      res.body.SUCCESS.should.have.property('title');
      res.body.SUCCESS.title.should.equal('Feed the dinosaur');
      res.body.SUCCESS.should.have.property('created');
      res.body.SUCCESS.created.should.equal(createdDate.toISOString());
      res.body.SUCCESS.should.have.property('dueDate');
      res.body.SUCCESS.dueDate.should.equal(dueDate.toISOString());
      res.body.SUCCESS.should.have.property('importance');
      res.body.SUCCESS.importance.should.equal(3);
      res.body.SUCCESS.should.have.property('completed');
      res.body.SUCCESS.completed.should.equal(false);
      done();
    });
  });

afterEach(function (done) {
  Task.collection.drop();
  done();
});

});
