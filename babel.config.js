module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/env', {
        'modules': false
      }
    ],
    '@vue/babel-preset-jsx'
  ]
}
