import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';

const userProfile = new SimpleSchema({
    firstName: {
        type: String,
        label: 'First Name',
        optional: false,
        defaultValue: ''
    },
    lastName: {
        type: String,
        label: 'First Name',
        optional: false,
        defaultValue: ''
    },
    fullName: {
        type: String,
        label: 'Full Name',
        optional: false,
        defaultValue: ''
    },
    gender: {
        type: String,
        label: 'Gender',
        optional: false,
        defaultValue: ''
    },
    tutorialGroupId: {
        type: Object,
        blackbox: true,
        label: 'Tutorial Group',
        optional: false,
        defaultValue: {}
    },
    nationality: {
        type: String,
        label: 'Nationality',
        optional: false,
        defaultValue: ''
    },
    studentType: {
        type: String,
        label: 'Student Type',
        optional: false,
        defaultValue: ''
    },
    relatedTutorialGroupIds: {
        type: Array,
        label: 'Related Tutorial Groups',
        optional: true,
        defaultValue: []
    },
    'relatedTutorialGroupIds.$': {
        type: Object,
        blackbox: true
    }
});

Meteor.users.schema = new SimpleSchema({
    username: {
        type: String,
        optional: false,
        label: 'Username'
    },
    profile: {
        type: userProfile
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    role: {
        type: String,
        optional: false,
        label: 'Role',
        defaultValue: 'user'
    },
    passwordUpdatedAt: {
        type: Date,
        defaultValue: new Date(),
        label: 'Password Updated Date',
    },
    isArchived: {
        type: Boolean,
        optional: false,
        defaultValue: false,
        label: 'Is Archived'
    },
    createdAt: {
        type: Date,
        optional: false,
        defaultValue: new Date(),
        label: 'Creation Date',
    },
    updatedAt: {
        type: Date,
        optional: false,
        defaultValue: new Date(),
        label: 'Last Updated Date',
    }
});

Meteor.users.attachSchema(Meteor.users.schema);

Accounts.config({
    loginExpirationInDays: null
});

if (Meteor.isServer) {
    function createSuperAdmin() {
        const admins = ['wee'];
        admins.forEach((admin, key) => {
            try {
                let userId = Accounts.findUserByUsername(admin);
                if (!userId) {
                    userId = Accounts.createUser({ username: admin, password: '123', profile: {} });
                    Meteor.users.update(userId, { $set: { role: 'super-admin' } });
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }

    createSuperAdmin();
}