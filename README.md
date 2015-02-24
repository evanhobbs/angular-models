[![Build Status](https://travis-ci.org/evanhobbs/angular-models.svg?branch=master)](https://travis-ci.org/evanhobbs/angular-models)
# Angular Models


Backbone-style models for Angular. If you're like me, one of the things you miss working with Angular is the lack of clearly defined models and collections which you can pass around to various parts of your app, attach custom methods to, call fetch on to refresh data, etc. I didn't find anything to my needs so I built a simple implementation of backbone models.

### How to use
*Check out the examples directory for a full working implementation with comments*
- Add a script tag for underscore.js (http://underscorejs.org/) and angular-backbone-models.js
- Add 'angular-models' as a dependency of your app or module:
````
angular.module( 'myApp', ['angular-models']);
````
- Inject 'Model' or 'Collection' and extend it just you would a backbone model giving it a 'urlRoot'
for the model or 'url' for the collection just as in Backbone. See backbone (http://backbonejs.org)
for more info:
````
.factory('MyModel', function(Model){
  return Model.extend({
	urlRoot: '/api/mymodel'
  });
````
- Now make an instance of the model and call .fetch(), .save(), .toJSON() or other methods as with Backbone.
````
var model = new MyModel({ id: 400 });
model.fetch();
model.set({ name: 'test' });
model.save();
console.log(model.toJSON());
````

### A couple gotchas
- The model's attributes are stored as model.atts (shorthand for model.attributes) so your template will need to reference model.atts not just model:
````
$scope.model = model;
now in the template this will not work:
<p>{{model.title}}</p>
but this will:
<p>{{model.atts.title}}</p>
````
- similarly a collections models are stored as collection.models so things like ng-repeat must reference the collection.models:
````
$scope.collection = collection;
now in the template:
<p ng-repeat="model in collection.models">{{model.attributes.title}}</p>
````
### To do:
Want to help? *Yes!*
- achieve better parity and consistency with how Backbone methods, arguments, etc.
- better test coverage
- remove dependency on underscore by using angular built in methods
- clean up
- better docs and instructions
