// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by plp-package.js.
import { name as packageName } from "meteor/plp-package";

// Write your tests here!
// Here is an example.
Tinytest.add('plp-package - example', function (test) {
  test.equal(packageName, "plp-package");
});
