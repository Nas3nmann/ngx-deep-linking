const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/demo-book-list',
    '<rootDir>/libs/ngx-deep-linking',
    '<rootDir>/apps/demo-form',
  ],
};
