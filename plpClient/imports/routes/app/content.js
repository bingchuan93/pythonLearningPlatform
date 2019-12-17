import Dashboard from '/imports/ui/layouts/mainApp/body/dashboard';
import Lessons from '/imports/ui/layouts/mainApp/body/lessons';

const contentRoutes = [{
    path: '/',
    exact: true,
    redirect: true,
    pathTo: '/dashboard'
}, {
    path: '/dashboard',
    name: 'dashboard',
    title: 'Dashboard',
    component: Dashboard,
}, {
    path: '/lessons',
    name: 'lessons',
    title: 'Lessons',
    component: Lessons,
}];

export default contentRoutes;