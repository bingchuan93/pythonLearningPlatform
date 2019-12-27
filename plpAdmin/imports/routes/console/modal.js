import TestBase from '/imports/ui/layouts/console/modal/testBase';
import TutorialGroupsCreate from '/imports/ui/layouts/console/modal/tutorialGroups/create';

const modalRoutes = [
    { name: 'test', path: '/dashboard/test', exact: true, component: TestBase },
    { name: 'tutorial-groups-create', path: '/tutorial-groups/create', exact: true, component: TutorialGroupsCreate },
];

export default modalRoutes;