describe('Model', function(){


	var model, Model;

	beforeEach(module('angular-models'))

	beforeEach(inject(function(_Model_){
		Model = _Model_;
		model = new Model();
	}));

	it('sets attributes passed in', function(){
		//the initial model attributes should be empty
		expect(model.attributes).to.deep.equal({});
		//test with a new model passing in attributes
		model = new Model({ a: 1, b: 2, c: 2 })
		expect(model.attributes).to.deep.equal({ a: 1, b: 2, c: 2 });
		//it should also have a shorthand for attributes (atts)
		expect(model.atts).to.be.an('object');
	});

	it('has the passed in options attached to it', function(){
		//the original model should have an empty options object
		expect(model.options).to.deep.equal({});
		//test with a new model passing in options
		model = new Model(null, { a: 1, b: 2, c: 2 })
		expect(model.options).to.deep.equal({ a: 1, b: 2, c: 2 });
	});

	it('has a parse method which returns exactly what is passed in', function(){
		expect(model.parse).to.be.a('function');
		expect(model.parse({a: 1, b: 2 })).to.deep.equal({a: 1, b: 2 })
	})

	it('only parses on init if the parse option is passed in', function(){
		sinon.spy(Model.prototype, 'parse');
		model = new Model();
		expect(Model.prototype.parse).to.not.have.been.called;
		model = new Model({}, { parse: true });
		expect(Model.prototype.parse).to.have.been.called;
		Model.prototype.parse.restore();

	});

	it('has an initialize method which gets called on contruction', function(){
		sinon.spy(Model.prototype, 'initialize');
		model = new Model();
		expect(Model.prototype.initialize).to.have.been.called;
		Model.prototype.initialize.restore();
	});

	it('if passed a collection as an option it will attach the collection as a property', function(){
		var obj = {};
		expect(model.collection).to.be.undefined;
		model = new Model(null, { collection: obj });
		expect(model.collection).to.equal(obj);
	});

	it('sets the id when an id is present on init', function(){
		expect(model.id).to.be.undefined;
		model = new Model({ id: 555 });
		expect(model.id).to.equal(555)
	});

	it('has an idAttribute which can be overridden', function(){
		expect(Model.prototype.idAttribute).to.equal('id');
		var MyModel = Model.extend({ idAttribute: '_id' });
		expect(MyModel.prototype.idAttribute).to.equal('_id')
	});

	it('has a urlRoot property', function(){
		expect(model.urlRoot).to.be.defined;
	});

	it('can set new attributes via the set() method using an object literal', function(){
		expect(model.attributes.a).to.be.undefined;
		model.set({ a: 'hey' });
		expect(model.attributes.a).to.equal('hey');
	});

	it('can set new attributes via the set() method using arguments', function(){
		expect(model.attributes.a).to.be.undefined;
		model.set('a', 'hey');
		expect(model.attributes.a).to.equal('hey');
	});

	it('set() method doesn\'t generate an error when passed empty or incomplete data', function(){
		model.set({});
		model.set();
		model.set(null, null);
		model.set({ test: null });
		model.set(null, 'test')
		model.set(false, true)
	});

	it('can return a copy of the attributes using toJSON', function(){
		var obj;
		//the object returned should be deeply equal the model's attributes
		//but not actually be the same object as this could generate unexpected
		//consequences
		expect(model.toJSON()).to.not.equal(model.attributes)
		expect(model.toJSON()).to.deep.equal({})
		model.attributes.a = 10;
		expect(model.toJSON()).to.deep.equal({ a: 10 });
	});

	it('can tell if it is a locally created model or exists on the server already', function(){
		expect(model.isNew()).to.be.true;
		model.set({ id: 555 })
		expect(model.isNew()).to.be.false;
	});

	it('can get model attributes', function(){
		expect(model.get('test')).to.be.undefined;
		model.set({ test: 555 })
		expect(model.get('test')).to.equal(555);
	});

	it('has a url method which returns the proper url for the model', function(){
		expect(model.url()).to.equal('');
		model.urlRoot = 'api';
		expect(model.url()).to.equal('api');
		model.id = 234234;
		expect(model.url()).to.equal('api/234234');
	});
});