import Dashboard from '/imports/ui/layouts/mainApp/body/dashboard';
import Lessons from '/imports/ui/layouts/mainApp/body/lessons';
import Quizzes from '/imports/ui/layouts/mainApp/body/quizzes';

const contentRoutes = [{
    path: '/',
    exact: true,
    redirect: true,
    pathTo: '/dashboard',
    showInSideMenu: false
}, {
    path: '/dashboard',
    name: 'dashboard',
    title: 'Dashboard',
    component: Dashboard,
    showInSideMenu: true
}, {
    path: '/lessons',
    name: 'lessons',
    title: 'Lessons',
    component: Lessons,
    showInSideMenu: true
}, {
    path: '/quizzes',
    name: 'quizzes',
    title: 'Quizzes',
    component: Quizzes,
    showInSideMenu: true
}, {
    path: '/quizzes/:id',
    exact: true,
    component: Quizzes,
    showInSideMenu: false
}];

export default contentRoutes;