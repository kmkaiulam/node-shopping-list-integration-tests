const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Recipes', function() {

    // Before our tests run, we activate the server. Our `runServer`
    // function returns a promise, and we return the that promise by
    // doing `return runServer`. If we didn't return a promise here,
    // there's a possibility of a race condition where our tests start
    // running before our server has started.
    before(function() {
      return runServer();
    });
  
    // although we only have one test module at the moment, we'll
    // close our server at the end of these tests. Otherwise,
    // if we add another test module that also has a `before` block
    // that starts our server, it will cause an error because the
    // server would still be running from the previous tests.
    after(function() {
      return closeServer();
    });

    // test strategy:
  //   1. make request to `/recipes`
  //   2. inspect response object and prove has right code and have
  //   right keys in response object.
  it('should list items on GET', function() {
    // for Mocha tests, when we're dealing with asynchronous operations,
    // we must either return a Promise object or else call a `done` callback
    // at the end of the test. The `chai.request(server).get...` call is asynchronous
    // and returns a Promise, so we just return it.
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');

        expect(res.body.length).to.be.at.least(1);
        // each recipe should be an object with key/value pairs
        // for `id`, `name` and `ingredients`.
        const expectedKeys = ['id', 'name', 'ingredients'];
        res.body.forEach(function(recipe) {
            expect(recipe).to.be.a('object');
            expect(recipe).to.include(expectedKeys);
        //edge cases
            //values missing
            expect(recipe.id).to.not.equal(null || undefined);
            expect(recipe.name).to.not.equal(null || undefined);
            expect(recipe.ingredients).to.not.equal(null || undefined);
            //correct data types
            expect(recipe.name).to.be.a('string');
            expect(recipe.ingredients).to.be.a('array');
        });
     });
   });


   it('should add an item on POST', function(){ 
    // test strategy:
    //  1. make a POST request with data for a new item
    //  2. inspect response object and prove it has right
    //  status code and that the returned object has an `id`
    const newRecipe  = {name: 'Smores', ingredients: ['marshmallow', 'chocolate', 'graham cracker']};
    return chai.request(app)
        .post('/recipes')
        .then(function(res) {
            expect(res).to.have.status(201)
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'name', 'ingredients');
            expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
            res.body.forEach(function(recipe) {
                expect(recipe.id).to.not.equal(null || undefined);
                expect(recipe.name).to.not.equal(null || undefined);
                expect(recipe.ingredients).to.not.equal(null || undefined);
                expect(recipe.name).to.be.a('string');
                expect(recipe.ingredients).to.be.a('array');
            });
        });
    });

    it('should update an item on PUT', function(){
        
    
    }










});
