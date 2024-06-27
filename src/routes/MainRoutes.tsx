import config from '../config';
import MainLayout from '../layouts/MainLayout';
import NotFound from '../pages/404/404';
import Home from '../pages/Home';
import BecomeTutor from '../pages/BecomeTutor';
import SearchTutors from '../pages/SearchTutors/SearchTutors';
import MakePayment from '../pages/Payment/MakePayment';
import PaymentSuccess from '../pages/Payment/PaymentSuccess/PaymentSuccess';
import TutorProfile from '../pages/TutorProfile/TutorProfile';
import SearchQuestions from '../pages/Questions/SearchQuestions';
import TutorDetail from '../pages/TutorDetail/TutorDetail';

//* ====================  Authorization for PUBLIC and CUSTOMER ==================== */
const MainRouter = () => {

    return <MainLayout />;
};


//* ==================== Define children routes: PUBLIC, CUSTOMER, NOT FOUND ==================== */
const publicRoutes = {
    children: [
        { path: config.routes.public.home, element: <Home /> },
        { path: config.routes.public.searchTutors, element: <SearchTutors /> },
        { path: config.routes.student.registerTutor, element: <BecomeTutor /> },
        { path: config.routes.public.searchQuestions, element: <SearchQuestions /> },
        { path: config.routes.public.searchTutors, element: <SearchTutors /> },
        { path: config.routes.public.tutorDetails, element: <TutorDetail /> },
    ],
};

const studentRoutes = {
    children: [
        { path: config.routes.student.registerTutor, element: <BecomeTutor /> },
        { path: config.routes.student.makePayment, element: <MakePayment /> },
        { path: config.routes.student.paymentSuccess, element: <PaymentSuccess /> }
    ],
};

const tutorRoutes = {
    children: [
        { path: config.routes.tutor.tutorProfile, element: <TutorProfile /> },
        { path: config.routes.student.makePayment, element: <MakePayment /> },
        { path: config.routes.student.paymentSuccess, element: <PaymentSuccess /> }
    ],
};


const notFoundRoutes = { path: '*', element: <NotFound /> };

//* ==================== Define main routes ==================== */
const MainRoutes = {
    path: '/',
    element: <MainRouter />,
    children: [publicRoutes, studentRoutes, tutorRoutes, notFoundRoutes],
};

export default MainRoutes;
