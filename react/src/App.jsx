import {
    Navigate,
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
            <RouterProvider router={appRouter} />
            <Toaster
                position='top-center'
                toastOptions={{
                    duration: 3500,
                    style: {
                        borderRadius: '12px',
                        background: '#1f2933',
                        color: '#fff',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '15px',
                        padding: '12px 16px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#4caf50',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#e5484d',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </>
    );
}
