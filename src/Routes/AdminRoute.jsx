import { Navigate, useLocation } from 'react-router';
import useAuth from '../Hook/UseAuth';
import useUserRole from '../Hook/useUserRole';
import Loading from '../Pages/LoadingPage/LoadingPage';

function AdminRoute({ children }) {
   const { user, loading: authLoading } = useAuth();
   const { role, roleLoading } = useUserRole();
   const location = useLocation();

   if (authLoading || roleLoading) {
      return <Loading />;
   }

   if (!user || role !== 'admin') {
      return <Navigate to="/forbidden" state={{ from: location }} replace />;
   }

   return children;
}

export default AdminRoute;
