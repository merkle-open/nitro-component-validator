# Nitro Pattern Validator
[![Coverage Status](https://coveralls.io/repos/github/namics/nitro-component-validator/badge.svg?branch=master)](https://coveralls.io/github/namics/nitro-component-validator?branch=master)
[![Codestyle](https://img.shields.io/badge/codestyle-namics-green.svg)](https://github.com/namics/eslint-config-namics)

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
