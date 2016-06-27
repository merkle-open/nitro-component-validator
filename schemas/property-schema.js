'use strict';
const _ = require('lodash');
const propertySchema = _.cloneDeep(require('ajv/lib/refs/json-schema-draft-04.json'));
propertySchema.id = 'nitro-validator-properties';
// Extract property schema from json schema
Object.keys(propertySchema.properties)
  .filter((property) => property !== 'properties')
  .forEach((property) => delete propertySchema.properties[property]);

module.exports = propertySchema;
