// Import client startup through a single index entry point
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
 
import Root from '/imports/ui/root.js';
 
Meteor.startup(() => {
  render(<Root />, document.getElementById('root'));
});