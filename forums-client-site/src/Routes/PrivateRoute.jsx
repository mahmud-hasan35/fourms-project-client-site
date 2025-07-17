// src/routes/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router';
import UseAuth from '../Hook/UseAuth';

const PrivateRoute = ({ children }) => {
  const { user, loading } = UseAuth();
  const location = useLocation();


  if(loading) {
    return <div className='text-center py-5'>
      <span  className='loading loading-spinner loading-xl'></span>
      </div>
  }

  if (!user) {
    return <Navigate state={{from: location.pathname}} to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
