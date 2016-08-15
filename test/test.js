/* eslint-disable id-blacklist, max-len, quotes, arrow-parens */

import test from 'ava';
import PatternValidator from '..';
import baseSchema from '../schemas/base-schema.js';

/**
 * @param {function} cb Callback
 * @returns {string} Error message
 */
function getErrorMessage(cb) {
	try {
		cb();
	} catch (e) {
		return e.message;
	}
	return undefined;
}

test('should not allow to add a schema without id', async t => {
	const validator = new PatternValidator();
	const err = getErrorMessage(() => {
		validator.addSchema({});
	});
	t.is(err, 'Schema id is required');
	t.pass();
});

test('should not throw if component is valid', async t => {
	const validator = new PatternValidator();
	const err = getErrorMessage(() => {
		validator.validateComponent({
			metaFile: 'components/atoms/button/pattern.json',
			data: {
				title: 'button',
				stability: 'alpha',
				type: 'atom',
				properties: {}
			}
		});
	});
	t.is(err, undefined);
	t.pass();
});

test('should throw if component is invalid', async t => {
	const validator = new PatternValidator();
	const err = getErrorMessage(() => {
		validator.validateComponent({
			metaFile: 'components/atoms/button/pattern.json',
			data: {
				title: 'button',
				stability: 'alpha',
				type: 'atom'
			}
		});
	});
	t.is(err, `Schema "nitro-validator-base" can't be applied for "components/atoms/button/pattern.json" because data should have required property 'properties'`);
	t.pass();
});

test('should throw if component does not match a custom schema', async t => {
	const validator = new PatternValidator({
		schemas: {
			customSchema: {
				id: 'customSchema',
				properties: {
					color: {
						enum: ['red', 'blue']
					}
				}
			}
		}
	});
	const err = getErrorMessage(() => {
		validator.validateComponent({
			metaFile: 'components/atoms/button/pattern.json',
			data: {
				title: 'button',
				stability: 'alpha',
				type: 'atom',
				properties: {},
				color: 'green'
			}
		});
	});
	t.is(err, `Schema "customSchema" can't be applied for "components/atoms/button/pattern.json" because data.color should be equal to one of the allowed values`);
	t.pass();
});

test('should not throw if validating multiple components and all are valid', async t => {
	const validator = new PatternValidator();
	const err = getErrorMessage(() => {
		validator.validateComponents([{
			metaFile: 'components/atoms/button/pattern.json',
			data: {
				title: 'button',
				stability: 'alpha',
				type: 'atom',
				properties: {}
			}
		}, {
			metaFile: 'components/atoms/radio/pattern.json',
			data: {
				title: 'radio',
				stability: 'alpha',
				type: 'atom',
				properties: {}
			}
		}]);
	});
	t.is(err, undefined);
	t.pass();
});

test('should throw when validating multiple components and one is invalid', async t => {
	const validator = new PatternValidator();
	const err = getErrorMessage(() => {
		validator.validateComponents({
			valid: {
				metaFile: 'components/atoms/radio/pattern.json',
				data: {
					title: 'radio',
					stability: 'alpha',
					type: 'atom',
					properties: {}
				}
			},
			invalid: {
				metaFile: 'components/atoms/button/pattern.json',
				data: {
					title: 'button',
					type: 'atom'
				}
			}
		});
	});
	t.is(err, `Schema "nitro-validator-base" can't be applied for "components/atoms/button/pattern.json" because data should have required property 'properties'`);
	t.pass();
});

test('should not throw if a schema is added twice', async t => {
	const validator = new PatternValidator();
	const err = getErrorMessage(() => {
		validator.addSchema(baseSchema);
		validator.validateComponent({
			metaFile: 'components/atoms/button/pattern.json',
			data: {
				title: 'button',
				stability: 'alpha',
				type: 'atom',
				properties: {}
			}
		});
	});
	t.is(err, undefined);
	t.pass();
});
