Meteor.methods({
    'Misc.testFlask'(params) {
        try {
            const result = HTTP.call('POST', 'http://localhost:5000/testCode', {
                data: {
                    str: params,
                    num: 12345
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(result);
            return result;
        } catch (e) {
            console.log(e);
        }
    }
})