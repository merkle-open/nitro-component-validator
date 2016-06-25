# Nitro Pattern Validator

This helper verifies that the pattern.json file of a pattern is valid

## Installation

```bash
npm i --save-dev nitro-pattern-validator
```

## Usage

```js
var validator = new PatternValidator();
try {
    validator.validateComponent({
      metaFile: 'components/atoms/button/pattern.json',
      data: {
        'name': 'button',
        'stability': 'alpha',
        'type': 'atom'
      }
    });
} catch(e) {
    console.log(e);
}
```