# Nitro Component Validator

[![Build Status](https://travis-ci.org/namics/nitro-component-validator.svg?branch=master)](https://travis-ci.org/namics/nitro-component-validator)
[![Coverage Status](https://coveralls.io/repos/github/namics/nitro-component-validator/badge.svg?branch=master)](https://coveralls.io/github/namics/nitro-component-validator?branch=master)
[![Codestyle](https://img.shields.io/badge/codestyle-namics-green.svg)](https://github.com/namics/eslint-config-namics)

This helper verifies that the pattern.json file of a component is valid

## Installation

```bash
npm i --save-dev @namics/nitro-component-validator
```

## Usage

```js
const ComponentValidator = require('@namics/nitro-component-validator');
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
