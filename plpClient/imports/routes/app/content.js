import Dashboard from '/imports/ui/layouts/mainApp/body/dashboard';
import Lessons from '/imports/ui/layouts/mainApp/body/lessons';
import Quizzes from '/imports/ui/layouts/mainApp/body/quizzes';
import StartQuiz from '/imports/ui/layouts/mainApp/body/quizzes/start';

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
    exact: true,
    showInSideMenu: true
}, {
    path: '/lessons',
    name: 'lessons',
    title: 'Lessons',
    component: Lessons,
    exact: true,
    showInSideMenu: true
}, {
    path: '/quizzes',
    name: 'quizzes',
    title: 'Quizzes',
    component: Quizzes,
    exact: true,
    showInSideMenu: true
}, {
    path: '/quizzes/:id',
    component: StartQuiz,
    exact: true,
    showInSideMenu: false
}];

export default contentRoutes;