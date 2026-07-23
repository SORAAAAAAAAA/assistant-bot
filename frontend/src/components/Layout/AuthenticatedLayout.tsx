import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import Sidebar from '@/components/Sidebar'

export default function AuthenticatedLayout() {

    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }


    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-grow relative overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}