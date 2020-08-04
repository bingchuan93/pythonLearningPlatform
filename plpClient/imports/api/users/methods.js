import { collections } from 'meteor/bingchuan:plp-collections';

if (Meteor.isServer) {
    Accounts.validateLoginAttempt((attemptInfo) => {
        if (attemptInfo.error) {
            return attemptInfo.error;
        }
        else if (attemptInfo.user.role != 'user') {
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