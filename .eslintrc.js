module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren':0 //禁用函数与括号之间的空格
  },

  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ]
}
