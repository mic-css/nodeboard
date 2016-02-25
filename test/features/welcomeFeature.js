var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();

chai.use(chaiHttp);

describe ('Nodeboard', function(){

  it ('serves json with a welcome message when there is a GET request to "/"', function(done){
    chai.request(server)
      .get('/')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.message.should.equal('welcome');
        done();
      });
  });

  it ('responds with a json including a list of all tasks when there is a GET request to "/tasks" ', function(done){
    chai.request(server)
      .get('/tasks')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
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
