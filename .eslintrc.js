const stylistic = require('@stylistic/eslint-plugin')

const customized = stylistic.configs.customize({
  indent: 2,
  quotes: 'single',
  semi: false,
  jsx: true,
})

module.exports = {
  plugins: [
    '@stylistic'
  ],
  rules: {
    ...customized.rules,
  }
}
