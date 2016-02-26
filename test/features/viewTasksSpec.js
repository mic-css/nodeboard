process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../../app');
var Task = require('../../models/taskModel');

var should = chai.should();
chai.use(chaiHttp);

describe ('Tasks', function() {

  describe('Read all tasks', function(){
    var createdDate;
    var dueDate;


    Task.collection.drop();

    beforeEach(function (done) {
      var newTask = new Task({
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
          res.body[0].title.should.equal('Feed the dinosaur');
          res.body[0].should.have.property('created');
          res.body[0].created.should.equal(createdDate.toISOString());
          res.body[0].should.have.property('dueDate');
          res.body[0].dueDate.should.equal(dueDate.toISOString());
          res.body[0].should.have.property('importance');
          res.body[0].importance.should.equal(3);
          res.body[0].should.have.property('completed');
          res.body[0].completed.should.equal(false);
          done();
        });
    });

  });


  it ('response with JSON including the specified task when there is a GET request to "/tasks/:id" where id is the task', function(){

  });

  it ('responds with json including the added object when there is a POST request to "/tasks" ', function(){

  });

  it ('responds with json including the object when there is a POST request to "/tasks/:id" where the object returned is the object', function(){

  });

  // it (PATCH request to 'tasks/:id' changes the object)
  // it (DELETE request to 'tasks/:id' deletes the object )
});
