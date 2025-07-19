import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useAuth from './useAuth';
import axios from 'axios';
import { getIdToken } from 'firebase/auth';

const axiosSecure = axios.create({
  baseURL: 'https://forums-server-site.vercel.app', // ✅ add https
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        try {
          // ✅ Smart refresh (no "true")
          const token = await getIdToken(user);
           // Firebase handles refresh internally
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (err) {
          console.error('Error getting token:', err);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error?.response?.status;

        if (status === 403) {
          navigate('/forbidden');
        } else if (status === 401) {
          logOut()
            .then(() => navigate('/login'))
            .catch(() => {});
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount or re-run
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
