var propertySchema = require('ajv/lib/refs/json-schema-draft-04.json');
propertySchema.id = 'json-schema-draft-04-properties';
// Extract property schema from json schema
Object.keys(propertySchema.properties)
  .filter((property) => property !== 'properties')
  .forEach((property) => delete propertySchema.properties[property]);

module.exports = propertySchema;