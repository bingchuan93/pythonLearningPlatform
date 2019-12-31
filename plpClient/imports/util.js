import { collections } from 'meteor/bingchuan:plp-collections';

export const getTutorialGroupOptions = (callback) => {
    Meteor.call('TutorialGroups.getAll', (error, result) => {
        const options = [];
        if (!error) {
            result.forEach((element) => {
                options.push({
                    label: element.name,
                    value: element._id.valueOf()
                })
            });
            callback(options);
        }
    })
}