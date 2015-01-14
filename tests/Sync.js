describe('Sync', function(){

	var $httpBackend, model, sync;

	beforeEach(module('angular-models'))

	beforeEach(inject(function(Model){
		var TestModel = Model.extend({
			urlRoot: 'api/test'
		})
		model = new TestModel({ a: 1, b: 2, c: 3 });
	}));

	beforeEach(inject(function(_$httpBackend_, _sync_){
		//save references in the module scope for concision
		sync = _sync_;
		$httpBackend = _$httpBackend_;
	}));

	it('makes a GET request when reading a new model', function(){
		sync('read', model)
		$httpBackend.expectGET('api/test')
		.respond({ id: 237, something: 'here' });
		$httpBackend.flush();
	});
	it('makes a GET request with the id when reading an existing model', function(){
		model.set('id', 237)
		sync('read', model)
		$httpBackend.expectGET('api/test/237')
		.respond({ id: 237, something: 'here' });
		$httpBackend.flush();
	});
	it('makes a POST request without the id when creating a new model', function(){
		sync('create', model)
		$httpBackend.expectPOST('api/test')
		.respond({ id: 237, something: 'here' });
		$httpBackend.flush();
	});
	it('makes a PUT request with the id when updating a model', function(){
		model.set('id', 237)
		sync('update', model)
		$httpBackend.expectPUT('api/test/237')
		.respond({ id: 237, something: 'here' });
		$httpBackend.flush();
	});
	it('includes the models json data with create and update requests', function(){
		sync('create', model)
		$httpBackend.expectPOST('api/test')
		.respond(function(method, url, data, headers){
			var data = JSON.parse(data);
			expect(data).to.deep.equal(model.toJSON());
			return [200, 'test']
		});
		$httpBackend.flush();

		model.set('id', 237);
		sync('update', model)
		$httpBackend.expectPUT('api/test/237')
		.respond(function(method, url, data, headers){
			var data = JSON.parse(data);
			expect(data).to.deep.equal(model.toJSON());
			return [200, 'test']
		});
		$httpBackend.flush();
	});

	it('makes DELETE request when deleting a model', function(){
		model.set('id', 237)
		sync('delete', model)
		$httpBackend.expectDELETE('api/test/237')
		.respond({ id: 237, something: 'here' });
		$httpBackend.flush();
	});

	it('returns an xhr object', inject(function($q){
		var xhr = sync('read', model)
		expect(xhr.success).to.be.a('function');
		$httpBackend.expectGET('api/test').respond('test')
		$httpBackend.flush();
	}));

	it('can be passed a success callback', function(){
		cb = sinon.spy();
		sync('read', model, {
			success: cb
		});
		$httpBackend.expectGET('api/test').respond('test')
		$httpBackend.flush();
		expect(cb).to.have.been.called;
	})

	it('can be passed a error callback', function(){
		cb = sinon.spy();
		var xhr = sync('read', model, {
			error: cb
		});
		$httpBackend.expectGET('api/test').respond(500, 'test')
		$httpBackend.flush();
		expect(cb).to.have.been.called;
	})

	it('can be passed a finally callback', function(){
		cb = sinon.spy();
		sync('read', model, {
			finally: cb
		});
		$httpBackend.expectGET('api/test').respond('test')
		$httpBackend.flush();
		expect(cb).to.have.been.called;
	})
});



