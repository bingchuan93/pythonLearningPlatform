import _ from 'lodash';
import { collections } from 'meteor/bingchuan:plp-collections';

const { Questions } = collections;

Meteor.methods({
    'Questions.getByIds'(ids) {
        try {
            return Questions.find({ _id: { $in: _.map(ids, (id) => new Mongo.ObjectID(id)) } }).fetch();
        } catch (e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to list assessments');
        }
    }
});