# karma-rest-fixtures-preprocessor

> Preprocessor for simplifying testing REST calls by adding json files as fixtures.

## Installation

The easiest way is to keep `karma-rest-fixtures-preprocessor` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-rest-fixtures-preprocessor": "~0.1"
  }
}
```

You can simple do it by:
```bash
npm install karma-rest-fixtures-preprocessor --save-dev
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      'fixtures/*.json': ['rest-fixtures']
    },

    files: [
      'fixtures/*.json',
      '*.js',
      '*.html'
    ],

    restFixturesPreprocessor: {
      // Base path to rest fixtures. Subdirectories will be added to URL path.
      basePath: 'fixtures/',
      // URL prefix
      restPath: '/rest/'
    }
  });
};
```

## How it works

Preprocessor requires .json files and converts them into .js files by storing json data as javascript objects under `__RESTFIXTURES__` namespace.


the following file:
`./fixtures/auth.user-post.json` (or `./fixtures/auth/user-post.json` if you prefer to use subdirectories)
```json
{
    "message": "Success"
}
```
will be accessible in your test environment:
```js
var fixture = __RESTFIXTURES__[0];
fixture // => {"method": "POST", "url": "/rest/auth/user", "response": {"message": "Success"}}
```

