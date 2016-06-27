'use strict';
var _ = require('lodash');
var Ajv = require('ajv');
// The json schemas
// @see http://json-schema.org/
var defaultSchemas = {
  base: require('./schemas/base-schema.js'),
  properties:  require('./schemas/property-schema.js')
};

function ComponentValidator(options) {
  options = _.extend({}, options);
  this.ajv = new Ajv();
  this.schemaIds = [];
  _.each(defaultSchemas, (schema) => this.addSchema(schema));
  if(options.schemas) {
    _.each(options.schemas, (schema) => this.addSchema(schema));
  }
}

ComponentValidator.prototype.addSchema = function(schema) {
  var schemaId = schema.id;
  if (!schemaId) {
    throw new Error('Schema id is required');
  }
  if (this.schemaIds.indexOf(schemaId) === -1) {
    this.ajv.addSchema(schema, schemaId);
    this.schemaIds.push(schemaId);
  }
};

ComponentValidator.prototype.validateComponents = function(components) {
  _.each(components, (component) => this.validateComponent(component));
  return true;
};

ComponentValidator.prototype.validateComponent = function(component) {
  this.schemaIds.forEach((schemaName) => {
    var isValid = this.ajv.validate(schemaName, component.data);
    if (!isValid) {
      throw new Error('Schema "' + schemaName + '" can\'t be applied for "' + component.metaFile + '" because ' + this.ajv.errorsText());
    }
  });
  return true;
};

module.exports = ComponentValidator;