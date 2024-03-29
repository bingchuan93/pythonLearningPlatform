import Dashboard from '/imports/ui/layouts/console/body/content/dashboard';
import Students from '/imports/ui/layouts/console/body/content/students';
import TutorialGroups from '/imports/ui/layouts/console/body/content/tutorialGroups';
import Assessments from '/imports/ui/layouts/console/body/content/assessments';

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
}, {
    path: '/tutorial-groups',
    name: 'tutorial-groups',
    title: 'Tutorial Groups',
    component: TutorialGroups,
    showInSideMenu: true,
}, {
    path: '/assessments',
    name: 'assessments',
    title: 'Assessments',
    component: Assessments,
    showInSideMenu: true,
}];

export default contentRoutes;