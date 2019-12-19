import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';

Meteor.users.after.insert(function(userId, doc) {
    Roles.addUsersToRoles(this._id, 'user', 'plp');
});

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
    gender: {
        type: String,
        label: 'Gender',
        optional: false,
        defaultValue: ''
    },
    tutorialGroup: {
        type: String,
        label: 'Tutorial Group',
        optional: false,
        defaultValue: ''
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
    roles: {
        type: Object,
        optional: true,
        blackbox: true
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
            let userId = Accounts.findUserByUsername(admin);
            if (!userId) {
                userId = Accounts.createUser({ username: admin, password: '123', profile: {} });
                Roles.setUserRoles(userId, [], 'plp');
                Roles.addUsersToRoles(userId, 'super-admin', 'plp-admin');
            }
        });
    }
    createSuperAdmin();
}