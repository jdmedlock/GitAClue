require('babel-core/register')({
  "presets": [
    [
      "env", {
        "targets": {
          "node": "current"
        }
      }
    ]
  ],
  ignore: /node_modules\/(?!ProjectB)/,
});