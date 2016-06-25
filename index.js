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
  this.schemaNames = [];
  _.each(defaultSchemas, (schema, schemaName) => this.addSchema(schema, schemaName));
  if(options.schemas) {
    _.each(options.schemas, (schema, schemaName) => this.addSchema(schema, schemaName));
  }
}

ComponentValidator.prototype.addSchema = function(schema, schemaName) {
  if (this.schemaNames.indexOf(schemaName) === -1) {
    this.ajv.addSchema(schema, schemaName);
    this.schemaNames.push(schemaName);
  }
};

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