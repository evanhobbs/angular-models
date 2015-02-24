var modelData = { id: 12345, title: 'Hello world' };
var collectionData = [
	{ id: 1, title: 'Testing1' },
	{ id: 2, title: 'Testing2' },
	{ id: 3, title: 'Testing3' },
	{ id: 4, title: 'Testing4' }
]

//1. Make sure underscore.js, underscore, and angular-models.js
//2. Specify 'angular-models' as a dependency
angular.module( 'exampleApp', ['angular-models'])

//3a. Extend the base model with the url and any other custom properties and methods
.factory('MyModel', function(Model){
	return Model.extend({
		urlRoot: '/api/mymodel'
  	});
})
//3b. Extend the BaseCollection with url and custom model
.factory('MyCollection', function(MyModel, Collection){
	return Collection.extend({
		url: '/api/mymodel',
		model: MyModel
  	});
})

//4. Inject your custom model or collection whereever you need them
//and create new instances of them
.controller('exampleController', function($scope, MyModel, MyCollection){
	//make a single model
	var myModel = new MyModel(modelData);
	//or make a collection
	var myCollection = new MyCollection(collectionData);
	console.log(myCollection.toJSON())

	//if you don't already have the data you could call myModel.fetch() here
	//to get it from the server

	//5. Add the model and/or collection to the scope
	$scope.model = myModel;
	$scope.collection = myCollection;
	//6. Profit!
});