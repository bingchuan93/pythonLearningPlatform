import SignIn from '/imports/ui/layouts/landingPage/signIn';
import SignUp from '/imports/ui/layouts/landingPage/signUp';
import MainApp from '/imports/ui/layouts/mainApp';

const rootRoutes = [
    { path: '/sign-in', exact: true, redirectIfAuthed: true, component: SignIn },
    { path: '/sign-up', exact: true, redirectIfAuthed: true, component: SignUp },
    { path: '/', exact: true, private: true, component: MainApp },
];

export default rootRoutes;