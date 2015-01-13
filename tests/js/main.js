//for concision just use expect
window.expect = chai.expect;
//use bdd syntax
mocha.setup('bdd');

angular.module( 'test', ['angular-models'])

.run(function (Model, Collection) {

	var model, collection;

	beforeEach(function(){
		model = new Model();
		collection = new Collection();
	});

	describe('Model', function(){
		it('sets attributes passed in', function(){
			//the initial model attributes should be empty
			expect(model.attributes).to.deep.equal({});

			//test with a new model passing in attributes
			model = new Model({ a: 1, b: 2, c: 2 })
			expect(model.attributes).to.deep.equal({ a: 1, b: 2, c: 2 });
		});
		it('has the passed in options attached to it', function(){
			//the original model should have an empty options object
			expect(model.options).to.deep.equal({});
			//test with a new model passing in options
			model = new Model(null, { a: 1, b: 2, c: 2 })
			expect(model.options).to.deep.equal({ a: 1, b: 2, c: 2 });
		})
	})

	mocha.run();

})
