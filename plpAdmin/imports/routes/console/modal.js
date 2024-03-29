import TestBase from '/imports/ui/layouts/console/modal/testBase';
import TutorialGroupCreate from '/imports/ui/layouts/console/modal/tutorialGroups/create';
import TutorialGroupRead from '/imports/ui/layouts/console/modal/tutorialGroups/read';
import TutorialGroupUpdate from '/imports/ui/layouts/console/modal/tutorialGroups/update';
import StudentRead from '/imports/ui/layouts/console/modal/students/read';
import StudentImport from '/imports/ui/layouts/console/modal/students/import';
import AssessmentCreate from '/imports/ui/layouts/console/modal/assessments/create';
import AssessmentView from '/imports/ui/layouts/console/modal/assessments/view';
import AssessmentUpdate from '/imports/ui/layouts/console/modal/assessments/update';

const modalRoutes = [
    { name: 'test', path: '/dashboard/test', exact: true, component: TestBase },
    { name: 'tutorial-groups-create', path: '/tutorial-groups/create', exact: true, component: TutorialGroupCreate },
    { name: 'tutorial-groups-view', path: '/tutorial-groups/view/:id', exact: true, component: TutorialGroupRead },
    { name: 'tutorial-groups-update', path: '/tutorial-groups/update/:id', exact: true, component: TutorialGroupUpdate },
    { name: 'students-view', path: '/students/view/:id', exact: true, component: StudentRead },
    { name: 'assessments-create', path: '/assessments/create', exact: true, component: AssessmentCreate },
    { name: 'assessments-view', path: '/assessments/view/:id', exact: true, component: AssessmentView },
    { name: 'assessments-update', path: '/assessments/update/:id', exact: true, component: AssessmentUpdate },
    { name: 'students-import', path: '/students/import', exact: true, component: StudentImport },
];

export default modalRoutes;