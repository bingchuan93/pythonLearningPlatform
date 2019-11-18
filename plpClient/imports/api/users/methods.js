if (Meteor.isServer) {
    Accounts.onLogin((loginInfo) => {
        // console.log(loginInfo);
    })
}