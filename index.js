'use strict';
const _ = require('lodash');
const Ajv = require('ajv');
// The json schemas
// @see http://json-schema.org/
const defaultSchemas = {};
defaultSchemas.base = require('./schemas/base-schema.js');
defaultSchemas.properties = require('./schemas/property-schema.js');


class ComponentValidator {
	constructor(options) {
		const _options = _.extend({}, options);
		this.ajv = new Ajv();
		this.schemaIds = [];
		_.each(defaultSchemas, (schema) => this.addSchema(schema));
		if (_options.schemas) {
			_.each(_options.schemas, (schema) => this.addSchema(schema));
		}
	}

	addSchema(schema) {
		const schemaId = schema.id;
		if (!schemaId) {
			throw new Error('Schema id is required');
		}
		if (this.schemaIds.indexOf(schemaId) === -1) {
			this.ajv.addSchema(schema, schemaId);
			this.schemaIds.push(schemaId);
		}
	}

	validateComponents(components) {
		_.each(components, (component) => this.validateComponent(component));
		return true;
	}

	validateComponent(component) {
		this.schemaIds.forEach((schemaName) => {
			const isValid = this.ajv.validate(schemaName, component.data);
			if (!isValid) {
				throw new Error(
					`Schema "${schemaName}" can't be applied for "${component.metaFile}" because ${this.ajv.errorsText()}`
				);
			}
		});
		return true;
	}
}

module.exports = ComponentValidator;
