import {
    Navigate,
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';
import { Root } from './pages/Root';
import Menu from './pages/Menu';
import Team from './pages/Team';
import Standings from './pages/Standings';
import Results from './pages/Results';
import Template from './pages/Template';
import GenResult from './pages/GenResult';

const appRouter = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Root />}>
            <Route path='/' element={<Menu />} />
            <Route element={<Template />}>
                <Route path='/resultados' element={<Results />} />
                <Route path='/clasificacion' element={<Standings />} />
                <Route path='/team' element={<Team />} />
                <Route path='/genresult' element={<GenResult />} />
            </Route>
            <Route path='/*' element={<Navigate to='/' />}></Route>
        </Route>
    )
);

export default function App() {
    return (
        <>
            {/* <AuthProvider> */}
            {/* <Provider store={store}> */}
            <RouterProvider router={appRouter} />
            {/* </Provider> */}
            {/* </AuthProvider> */}
        </>
    );
}
