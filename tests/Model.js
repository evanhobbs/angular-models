describe('Model', function(){
	beforeEach(module('angular-models'))

	var model;

	beforeEach(inject(function(Model, Collection){
		model = new Model();
	}))

	it('sets attributes passed in', inject(function(Model){
		//the initial model attributes should be empty
		expect(model.attributes).to.deep.equal({});
		//test with a new model passing in attributes
		model = new Model({ a: 1, b: 2, c: 2 })
		expect(model.attributes).to.deep.equal({ a: 1, b: 2, c: 2 });
		//it should also have a shorthand for attributes (atts)
		expect(model.atts).to.be.an('object');
	}));

	it('has the passed in options attached to it', inject(function(Model){
		//the original model should have an empty options object
		expect(model.options).to.deep.equal({});
		//test with a new model passing in options
		model = new Model(null, { a: 1, b: 2, c: 2 })
		expect(model.options).to.deep.equal({ a: 1, b: 2, c: 2 });
	}));

	it('has a parse method which returns exactly what is passed in', function(){
		expect(model.parse).to.be.a('function');
		expect(model.parse({a: 1, b: 2 })).to.deep.equal({a: 1, b: 2 })
	})
	
	it('has an initialize method which gets called on contruction', inject(function(Model){
		sinon.spy(Model.prototype, 'initialize');
		model = new Model();
		expect(Model.prototype.initialize).to.have.been.called;
		Model.prototype.initialize.restore();
	}))
});