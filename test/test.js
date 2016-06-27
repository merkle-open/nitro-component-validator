import test from 'ava';
import PatternValidator from '..';

function getErrorMessage(cb) {
  try {
    cb();
  } catch (e) {
    return e.message;
  }
}

test('should not allow to add a schema without id', async t => {
  var validator = new PatternValidator();
  var err = getErrorMessage(() => {
    validator.addSchema({});
  });
  t.is(err, 'Schema id is required');
  t.pass();
});

test('should not throw if component is valid', async t => {
  var validator = new PatternValidator();
  var err = getErrorMessage(() => {
    validator.validateComponent({
      metaFile: 'components/atoms/button/pattern.json',
      data: {
        'name': 'button',
        'stability': 'alpha',
        'type': 'atom',
        'properties': {}
      }
    });
  });
  t.is(err, undefined);
  t.pass();
});

test('should throw if component is invalid', async t => {
  var validator = new PatternValidator();
  var err = getErrorMessage(() => {
    validator.validateComponent({
      metaFile: 'components/atoms/button/pattern.json',
      data: {
        'name': 'button',
        'stability': 'alpha',
        'type': 'atom'
      }
    });
  });
  t.is(err, `Schema "nitro-validator-base" can't be applied for "components/atoms/button/pattern.json" because data should have required property 'properties'`);
  t.pass();
});

test('should throw if component does not match a custom schema', async t => {
  var validator = new PatternValidator({
    schemas: {
      customSchema: {
        id: 'customSchema',
        properties: {
          color: {
            enum: ["red", "blue"]
          }
        }
      }
    }
  });
  var err = getErrorMessage(() => {
    validator.validateComponent({
      metaFile: 'components/atoms/button/pattern.json',
      data: {
        'name': 'button',
        'stability': 'alpha',
        'type': 'atom',
        'properties': {},
        'color': 'green'
      }
    });
  });
  t.is(err, `Schema "customSchema" can't be applied for "components/atoms/button/pattern.json" because data.color should be equal to one of the allowed values`);
  t.pass();
});

test('should not throw if validating multiple components and all are valid', async t => {
  var validator = new PatternValidator();
  var err = getErrorMessage(() => {
    validator.validateComponents([{
      metaFile: 'components/atoms/button/pattern.json',
      data: {
        'name': 'button',
        'stability': 'alpha',
        'type': 'atom',
        'properties': {}
      }
    }, {
      metaFile: 'components/atoms/radio/pattern.json',
      data: {
        'name': 'radio',
        'stability': 'alpha',
        'type': 'atom',
        'properties': {}
      }
    }]);
  });
  t.is(err, undefined);
  t.pass();
});

test('should throw when validating multiple components and one is invalid', async t => {
  var validator = new PatternValidator();
  var err = getErrorMessage(() => {
    validator.validateComponents({
      valid: {
        metaFile: 'components/atoms/radio/pattern.json',
        data: {
          'name': 'radio',
          'stability': 'alpha',
          'type': 'atom',
          'properties': {}
        }
      },
      invalid: {
        metaFile: 'components/atoms/button/pattern.json',
        data: {
          'name': 'button',
          'type': 'atom'
        }
      }
    });
  });
  t.is(err, `Schema "nitro-validator-base" can't be applied for "components/atoms/button/pattern.json" because data should have required property 'properties'`);
  t.pass();
});

test('should not throw if a schema is added twice', async t => {
  var validator = new PatternValidator();
  var err = getErrorMessage(() => {
    validator.addSchema(require('../schemas/base-schema.js'));
    validator.validateComponent({
      metaFile: 'components/atoms/button/pattern.json',
      data: {
        'name': 'button',
        'stability': 'alpha',
        'type': 'atom',
        'properties': {}
      }
    });
  });
  t.is(err, undefined);
  t.pass();
});