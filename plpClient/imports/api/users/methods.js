import { collections } from 'meteor/bingchuan:plp-collections';

if (Meteor.isServer) {
    Accounts.validateLoginAttempt((attemptInfo) => {
        if (attemptInfo.error) {
            return attemptInfo.error;
        }
        else if (!Roles.userIsInRole(attemptInfo.user._id, 'user', 'plp')) {
            return false;
        }
        else if (attemptInfo.type == 'resume') {
            return true;
        }
        return true;
    })

    Accounts.onLogin((loginInfo) => {
        // console.log(loginInfo);
    })
}