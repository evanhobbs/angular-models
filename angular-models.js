//     Angular Backbone Models
//     (c) 2014 Evan Hobbs
//     May be freely distributed under the MIT license.
(function(factory) {

	//for AMD environments
	if (typeof define === 'function' && define.amd) {
		define(['underscore', 'angular'], function(_, angular) {
			//if angular isn't exporting anyting then grab the window version 
			factory(angular || window.angular, _)
		});

	//Node/commonJS
	} else if (typeof exports !== 'undefined') {
		var _ = require('underscore');
		require('angular');
		//if angular doesn't export itself yet so just grab the window version
		factory(window.angular, _);

	// Where dependencies are already loaded as globals
	} else {
		factory(window.angular, window._);		
	}


}(function (angular, _){
	// Helper function to correctly set up the prototype chain, for subclasses.
	// Similar to `goog.inherits`, but uses a hash of prototype properties and
	// class properties to be extended.
	var extend = function(protoProps, staticProps) {
		var parent = this;
		var child;

		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		if (protoProps && _.has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function(){ return parent.apply(this, arguments); };
		}

		// Add static properties to the constructor function, if supplied.
		_.extend(child, parent, staticProps);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function(){ this.constructor = child; };
		Surrogate.prototype = parent.prototype;
		/*jshint -W058 */
		child.prototype = new Surrogate;

		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps) _.extend(child.prototype, protoProps);

		// Set a convenience property in case the parent's prototype is needed
		// later.
		child.__super__ = parent.prototype;

		return child;
	};


	angular.module('angular-models', [])
	/*==========  Base Model  ==========*/
	.factory('Model', function($rootScope, $http){
		var Model = function(attributes, options){
			attributes = attributes || {};
			options = options || {};
			this.options = options
			this.attributes = attributes;
			if (typeof attributes.id !== 'undefined') { this.id = attributes.id }
		}

		Model.extend = extend;

		_.extend(Model.prototype, {
			urlPath: '',

			set: function(atts){
				_.extend(this.attributes, atts);
			},

			toJSON: function(options) {
			  return _.clone(this.attributes);
			},

			save: function(options){
				var that = this, xhr;
				if (this.isNew()) xhr = $http.post(this.urlRoot, this.attributes);
				else xhr = $http.put(this.urlRoot + '/' + this.id, this.attributes);

				xhr.success(function(data, status, headers, config){
					if (typeof data === 'object') {
						that.id = data.id;
						that.set(data);					
					}
				})

				return xhr;
			},

			// A model is new if it has never been saved to the server, and lacks an id.
			isNew: function() {
			  return !this.id;
			},

			destroy: function(){
				var that = this;
				if (this.collection) {
					this.collection.remove(this);
				}
				var xhr = $http.delete(this.urlRoot+'/'+this.id);
				return xhr;
			},

			fetch: function(options){
				var xhr, that = this;
				_.defaults(options, this.fetchData);
				
				//do the request and preserve the promise
				this._fetch = xhr = $http.get(this.urlRoot + '/' + this.id, { params: options})

				//update model attributes when the model returns
				xhr.then(function(response){
					//only attempt to set model properties if we get back an object as opposed to
					//error string
					if (typeof response.data === 'object') {
						that.id = response.data.id;
						that.set(response.data);
					}
				});

				return this._fetch;
			},
			fetchOnce: function(options) {
				if (!this._fetch) this.fetch(options);
			},

			hasFetched: function(){
				return typeof this._fetch !== 'undefined';
			}
		});

		return Model;

	})


	/*==========  Base Collection  ==========*/
	.factory('Collection', function($q, Model, $rootScope, $http){

		var Collection = function(models, options){
			options = options || {};
			this.options = options
			this.models = [];
		};

		Collection.extend = extend;

		_.extend(Collection.prototype, {

			urlPath: '',

			Model: Model,

			get: function(id){
				//ensure the id is a number and not a number string
				id = parseInt(id, 10);
				return _.findWhere(this.models, { id: id });
			},

			each: function(fn){
				_.each(this.models, fn, this);
			},

			remove: function(model){
				var index = _.indexOf(this.models, model);
				this.models.splice(index, 1);
			},

			toJSON: function(options) {
				return _.map(this.models, function(model){ return model.toJSON(options); })
			},

			add: function(models){
				var that = this;
				//ensure that models is an array even if an object is passed;
				_.flatten([models], true);
				_.each(models, function(newModel){
					var model = that.get(newModel.id);
					//if the model doesn't exist already create a new one
					if (!model) {
						model = new that.model(newModel);
						that.models.push(model);
						//preserve a reference to the parent collection
						model.collection = that;
						//add and resolve a promise so it matches the pattern of individual model fetches
						//even though this model hasn't been fetched by itself
						var _fetch = $q.defer();
						_fetch.resolve();
						model._fetch = _fetch.promise;
					}
					//otherwise update the existing model
					else {
						model.set(newModel);
					}
				});

			},

			fetch: function(options){
				var xhr, that = this;
				options = options || {};
				
				//grab the rest service from the model prototype -- assumes that all models will have
				//one defined
				this._fetch = xhr = $http.get(this.url, { params: options });

				xhr.then(function(response){
					if (typeof response.data !== 'string') that.add(response.data);
				});

				return this._fetch;
			},

			fetchOnce: function(options) {
				if (!this._fetch) this.fetch(options);
			},

			/*
				Method: startPolling
				...starts a collection polling the API at a given interval
			
				Parameters:
					interval - integer value representing the number of micoseconds in between polls
			*/
			startPolling: function(interval){
				var that = this;
				interval = interval || 15000;
				if (!this._polling) {
					this.fetch();
					this._polling = setInterval(function(){ that.fetch(); }, interval);
				}
			},

			/*
				Method: stopPolling
				...cancels polling actions on a collection
			
			*/
			stopPolling: function(){
				clearInterval(this._polling);
				delete this._polling;
			}

		});

		return Collection;
	})

}));

