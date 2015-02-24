//1. Make sure angular-models.js is loaded
//2. Specify 'angular-models' as a dependency
angular.module( 'exampleApp', ['angular-models'])

//3. Extend the base model with the url and any other custom properties and methods
.factory('MyModel', function(Model){
	return Model.extend({
		urlRoot: '/api/mymodel'
  	});
})

//4. Inject your custom model whereever you need it and create new instances of it
.controller('exampleController', function($scope, MyModel){
	var data = { id: 12345, title: 'Hello world' };
	var myModel = new MyModel(data);
	//if you don't already have the data you could call myModel.fetch() here
	//to get it from the server

	//5. Add the model to the scope
	$scope.model = myModel;

	//6. Profit!
});