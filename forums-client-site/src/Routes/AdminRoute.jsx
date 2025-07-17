
import { Navigate, useLocation } from 'react-router';
import UseAuth from '../Hook/useAuth';
import useUserRole from '../Hook/useUserRole';
import Loading from '../Pages/LoadingPage/LoadingPage';



function AdminRoute({ children }) {
   const { user, loading: authLoading } = UseAuth();
   const { role, roleLoading } = useUserRole();
   const location = useLocation();

   if (authLoading || roleLoading) {
      return <Loading />;
   }

   
   if (!user || role !== 'admin') {
      return <Navigate to="/forbedan" state={{ from: location }} replace />;
   }


   return children;
}

export default AdminRoute;
