import { useQuery } from "@tanstack/react-query";
import UseAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = UseAuth();
  
  const axiosSecure = useAxiosSecure();

  const {
    data: role = "user",
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/role/${user?.email}`);
      
      
      return res.data.role;
    },
  });

  return { role, roleLoading, refetch };
};

export default useUserRole;
