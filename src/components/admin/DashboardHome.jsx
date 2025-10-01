import useUserRole from "../Hook/useUserRole";
import Loading from "../../Pages/LoadingPage/LoadingPage";
import AdminProfile from "../dashboard/AdminProfile";
import MyProfile from "../userDasbord/MyProfile";
import Forbidden from "./Forbidden";




function DashboardHome() {
   const { role, roleLoading } = useUserRole();

   if (roleLoading) {
      return <Loading />;
   }

   if (role === "user") {
      return <MyProfile />;
   } else if (role === "admin") {
      return <AdminProfile/>;
   } else {
      return <Forbidden/>
   }
}

export default DashboardHome;
