import axios from 'axios'
import UseAuth from './useAuth';
import { useNavigate } from 'react-router';



const axiosSecure = axios.create({
  baseURL: `forums-server-site.vercel.app`
});
const useAxiosSecure = () => {
  const { user,logOut } = UseAuth();
  console.log(user);
  
  const navigate = useNavigate();
  
  


  axiosSecure.interceptors.request.use(config => {
    console.log('User in axiosSecure:',user);
    
    config.headers.Authorization = `Bearer ${user.accessToken}`
    return config;
  }, error => {
    return Promise.reject(error);
  })

  axiosSecure.interceptors.response.use(res => {
    return res
  }, error => {
    console.log('inside res interceptors', error.status);
    const status = error.status;
    if(status === 403) {
      navigate('/forbidden');
    }
    else if (status === 401){
      logOut()
      .then(() => {
        navigate('/login')
      })
      .catch(()=> { })
    }
    return Promise.reject(error);

    
  })

  return axiosSecure;
};
export default useAxiosSecure;
