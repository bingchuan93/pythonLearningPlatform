import Dashboard from '/imports/ui/layouts/console/body/content/dashboard';
import Students from '/imports/ui/layouts/console/body/content/students';

const contentRoutes = [{
    path: '/',
    exact: true,
    redirect: true,
    pathTo: '/dashboard',
    showInSideMenu: false,
}, {
    path: '/dashboard',
    name: 'dashboard',
    title: 'Dashboard',
    component: Dashboard,
    showInSideMenu: true,
}, {
    path: '/students',
    name: 'students',
    title: 'Students',
    component: Students,
    showInSideMenu: true,
}];

export default contentRoutes;