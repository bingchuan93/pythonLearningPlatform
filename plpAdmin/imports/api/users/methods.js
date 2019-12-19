Meteor.methods({
    'Students.list'(params) {
        try {
            const { pageSize, page, filters, fields, sort } = params;
            if (!filters['roles.plp']) {
                // filters['roles.plp-admin'] = { $in: ['super-admin', 'admin'] };
                filters['roles.plp'] = { $in: ['user'] };
            }
            const students = Meteor.users.find(filters, { fields: fields, sort: sort, skip: page * pageSize, limit: pageSize }).fetch();
            const count = Meteor.users.find(filters).count();
            return { data: students, count: count };
        }
        catch (e) {
            if (e.reason) {
                throw new Meteor.Error(e.error, e.reason);
            }
            throw new Meteor.Error('error', 'Fail to list students');
        }
    }
})

if (Meteor.isServer) {
    Accounts.validateLoginAttempt((attemptInfo) => {
        if (attemptInfo.error) {
            return attemptInfo.error;
        }
        else if (!Roles.userIsInRole(attemptInfo.user._id, ['super-admin','admin'], 'plp-admin')) {
            return false;
        }
        return true;
    });
}