import {
  createBrowserRouter,
} from "react-router";
import RootLayout from "../Layouts/RootLayout";
// import Home from "../Pages/Home/Home/Home";
// import Login from "../Pages/Authentication/Login/Login";
// import Register from "../Pages/Authentication/Register/Register";
// import Banner from "../Pages/Home/Banner/Banner";
// import CreatePostModal from "../Pages/Home/Banner/CreatePost";
// import CreatePost from "../Pages/Home/Banner/CreatePost";
// import AnnouncementSection from "../Pages/Home/Banner/AnnouncementSection";
// import AddAnnouncementForm from "../Pages/Home/Banner/AddAnnouncementForm";
// import AllPost from "../Pages/Home/HomePagePost/AllPost";
// import PostDetails from "../Pages/Home/HomePagePost/PostDetails";
import PrivateRoute from "../Routes/PrivateRoute";

import Forbidden from "../components/admin/Forbidden";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardHome from "../components/admin/DashboardHome";
import MyProfile from "../components/userDasbord/MyProfile";
import AddFrom from "../components/home/AddFrom";
import MyPost from "../components/userDasbord/MyPost";
import Coomentsuserdas from "../components/userDasbord/Coomentsuserdas";
import ManageUsers from "../components/dashboard/ManageUsers";
import AdminProfile from "../components/dashboard/AdminProfile";
import MakeAnnouncement from "../components/dashboard/MakeAnnouncement";
import ReportComant from "../components/dashboard/ReportComant";
import PostDetailsPage from "../components/home/PostDetlisPage";
import Membership from "../components/home/Membership";
import HomeALL from "../Pages/HomeAll/HomeAll";
import Register from "../Pages/Authentication/Register/Register";
import Regsiter from "../Auth/auth/Regsiter";
import Login from "../Auth/auth/Login";
import AllTag from "../components/home/AllTag";
import AdminRoute from "../components/admin/AdminRout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
       {
            path: "/",
            index: true,
            element: <HomeALL></HomeALL>

         },
         {
            path: "post/:id",
            element: <PostDetailsPage />
         },
         {
            path: "/login",
            element: <Login />
         },
         

         {
            path: "/reghiter",
            element: <Regsiter />
         },

         

         {
            path: "/forbedan",
            element: <Forbidden />
         },
         {
            path: "/membership",
            element: <PrivateRoute><Membership></Membership></PrivateRoute> 
         },
         {
            path: '/all-tag',
            element: <AllTag></AllTag>

         },



      //   {
      //     path: '/login',
      //     Component: Login

      //   },
      //   {
      //     path: '/register',
      //     Component: Register

      //   },
    ]
  },


     {
      path: "/dashboard",
      element: <PrivateRoute><DashboardLayout /></PrivateRoute> ,
      children: [
      
         // user dasbord

         {
            index: true,
            element: <DashboardHome />
         },

         {
            path: "my-profile",
            element: <PrivateRoute><MyProfile /></PrivateRoute> 
         },
         {
            path: "add-post", 
            element: <PrivateRoute> <AddFrom /> </PrivateRoute>
         },

         {
            path: "my-Post",
            element: <PrivateRoute><MyPost /></PrivateRoute>
         },
         

         {
            path: "comments/:postId",
            element: <PrivateRoute><Coomentsuserdas /></PrivateRoute>,
         },

         // user dasbord

         //make admin
         
         {
            path: "make-admin",
            element: <AdminRoute><ManageUsers /></AdminRoute> 
         },

         {
            path: "admin-profile",
            element: <AdminRoute><AdminProfile /></AdminRoute> 
         },

         {
            path: "makeAnnouncement",
            element: <AdminRoute><MakeAnnouncement /></AdminRoute> 
         },
         {
            path: "reportcommant",
            element: <AdminRoute><ReportComant /></AdminRoute> 
         }
         
          
      ]

   }
]);