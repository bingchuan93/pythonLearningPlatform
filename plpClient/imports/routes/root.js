import App from '/imports/ui/layouts/app';
import SignIn from '/imports/ui/layouts/landingPage/signIn';
import SignUp from '/imports/ui/layouts/landingPage/signUp';

const rootRoutes = [
    { path: '/', exact: true, redirectTo: '/sign-in' },
    { path: '/sign-in', exact: true, redirectIfAuthed: true, component: SignIn },
    { path: '/sign-up', exact: true, redirectIfAuthed: true, component: SignUp }
];

export default rootRoutes;