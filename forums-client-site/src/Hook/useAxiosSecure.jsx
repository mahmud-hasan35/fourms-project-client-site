import axios from 'axios'
import UseAuth from './useAuth';



const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`
});
const useAxiosSecure = () => {
  const { user } = UseAuth()
  console.log(user);
  


  axiosSecure.interceptors.request.use(config => {
    console.log('User in axiosSecure:',user);
    
    config.headers.Authorization = `Bearer ${user.accessToken}`
    return config;
  }, error => {
    return Promise.reject(error);
  })

  return axiosSecure;
};
export default useAxiosSecure;
