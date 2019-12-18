import SignIn from '/imports/ui/layouts/landingPage/signIn';
import SignUp from '/imports/ui/layouts/landingPage/signUp';

const rootRoutes = [
    { path: '/sign-in', exact: true, redirectIfAuthed: true, component: SignIn },
    { path: '/sign-up', exact: true, redirectIfAuthed: true, component: SignUp },
    { path: '/', exact: false, private: true, component: null },
];

export default rootRoutes;