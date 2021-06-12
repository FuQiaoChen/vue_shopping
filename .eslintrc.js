module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ['plugin:vue/vue3-essential', '@vue/standard'],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 0,
    'spaced-comment': 0,
    '/* eslint-disable */': 0
  },

  extends: ['plugin:vue/vue3-essential', '@vue/standard'],

  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
