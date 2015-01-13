//for concision just use expect
var expect = chai.expect;

describe('Model', function(){
	beforeEach(module('angular-models'))

	var model;

	beforeEach(inject(function(Model, Collection){
		model = new Model();
	}))

	it('sets attributes passed in', inject(function(Model){
		console.log(Model)
		//the initial model attributes should be empty
		expect(model.attributes).to.deep.equal({});
		console.log(model, Model)
		//test with a new model passing in attributes
		model = new Model({ a: 1, b: 2, c: 2 })
		expect(model.attributes).to.deep.equal({ a: 1, b: 2, c: 2 });
	}));
	it('has the passed in options attached to it', inject(function(Model){
		//the original model should have an empty options object
		expect(model.options).to.deep.equal({});
		//test with a new model passing in options
		model = new Model(null, { a: 1, b: 2, c: 2 })
		expect(model.options).to.deep.equal({ a: 1, b: 2, c: 2 });
	}));
});