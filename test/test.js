import test from 'ava';
import PatternValidator from '..';

function getErrorMessage(cb) {
  try {
    cb();
  } catch(e) {
    return e.message;
  }
}

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
  t.is(err, `Schema "base" can't be applied for "components/atoms/button/pattern.json" because data should have required property 'properties'`);
  t.pass();
});

test('should throw if component does not match a custom schema', async t => {
  var validator = new PatternValidator({
    schemas: {
      customSchema: {
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
