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
  _.each(defaultSchemas, (schema, schemaName) => this.ajv.addSchema(schema, schemaName));
  this.schemaNames = Object.keys(defaultSchemas);
  if(options.schemas) {
    _.each(options.schemas, (schema, schemaName) => this.ajv.addSchema(schema, schemaName));
    this.schemaNames = this.schemaNames.concat(Object.keys(options.schemas));
  }
}

ComponentValidator.prototype.validateComponents = function(components) {
  _.each(components, (component) => this.validate(component));
  return true;
};

ComponentValidator.prototype.validateComponent = function(component) {
  this.schemaNames.forEach((schemaName) => {
    var isValid = this.ajv.validate(schemaName, component.data);
    if (!isValid) {
      throw new Error('Schema "' + schemaName + '" can\'t be applied for "' + component.metaFile + '" because ' + this.ajv.errorsText());
    }
  });
  return true;
};

module.exports = ComponentValidator;