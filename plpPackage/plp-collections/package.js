Package.describe({
  name: 'bingchuan:plp-collections',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.8.1');
  api.use([
    'ecmascript',
		'aldeed:collection2@3.0.0',
		'accounts-password',
		'alanning:roles',
		'matb33:collection-hooks',
  ]);
  api.mainModule('plp-client.js', 'client');
  api.mainModule('plp-server.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('plp-package');
  api.mainModule('plp-package-tests.js');
});
