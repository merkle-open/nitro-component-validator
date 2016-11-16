'use strict';

/* eslint-disable require-jsdoc */

const _ = require('lodash');
const Ajv = require('ajv');
// The json schemas
// @see http://json-schema.org/
const defaultSchemas = {};
defaultSchemas.base = require('./schemas/base-schema.js');
defaultSchemas.properties = require('./schemas/property-schema.js');

/**
 * The component validator class is a helper to lint package.json files
 */
class ComponentValidator {
	/**
	 * Create a new pattern.json validator instance
	 * @param {Object} options options
	 */
	constructor(options) {
		const _options = _.extend({}, options);
		this.ajv = new Ajv();
		this.schemaIds = [];
		_.each(defaultSchemas, (schema) => this.addSchema(schema));
		if (_options.schemas) {
			_.each(_options.schemas, (schema) => this.addSchema(schema));
		}
	}
	/**
	 * Add a json schema definition
	 * @param {Object} schema - The JSON Schema
	 * @returns {undefined} void
	 */
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
	/**
	 * Pass multiple components to validate
	 * @param {Object} components Component objects
	 * @returns {boolean} success
	 */
	validateComponents(components) {
		_.each(components, (component) => this.validateComponent(component));
		return true;
	}
	/**
	 * Validate a pattern.json
	 * @param {Object} component Component object
	 * @returns {boolean} success
	 */
	validateComponent(component) {
		this.schemaIds.forEach((schemaName) => {
			const isValid = this.ajv.validate(schemaName, component.data);
			if (!isValid) {
				throw new Error(
					`Schema "${schemaName}" can't be applied for "${component.metaFile}" because ${this.ajv.errorsText()}`
				);
			}
			Object.keys(component.data.properties).forEach((propertyName) => {
				if (!(/^[a-z][a-z\-0-9]*$/).test(propertyName)) {
					throw new Error(
						`Schema "${component.metaFile}" property "${propertyName}" contains invalid characters. ` +
						'Please use kebab case.'
					);
				}
			});
		});
		return true;
	}
}

module.exports = ComponentValidator;
