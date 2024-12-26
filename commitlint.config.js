module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [1, 'always', 100],
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'cicd']],
    'scope-enum': [2, 'always', ['init', 'release', 'config', 'etc', '']],
  },
};
