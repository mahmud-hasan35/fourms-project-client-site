import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import DashboardLayout from "../Layouts/DashboardLayout";

// Public pages
import HomeALL from "../Pages/HomeAll/HomeAll";
import PostDetailsPage from "../components/home/PostDetlisPage";
import Membership from "../components/home/Membership";
import AllTag from "../components/home/AllTag";
import Login from "../Auth/auth/Login";
import Regsiter from "../Auth/auth/Regsiter";

// User Dashboard pages
import DashboardHome from "../components/admin/DashboardHome";
import Forbidden from "../components/admin/Forbidden";
import MyProfile from "../components/userDasbord/MyProfile";
import AddFrom from "../components/home/AddFrom";
import MyPost from "../components/userDasbord/MyPost";
import Coomentsuserdas from "../components/userDasbord/Coomentsuserdas";

// Admin Dashboard pages
import ManageUsers from "../components/dashboard/ManageUsers";
import AdminProfile from "../components/dashboard/AdminProfile";
import MakeAnnouncement from "../components/dashboard/MakeAnnouncement";
import ReportComant from "../components/dashboard/ReportComant";

// Routes Protection
import PrivateRoute from "../Routes/PrivateRoute";
import AdminRoute from "../Routes/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomeALL />,
      },
      {
        path: "post/:id",
        element: <PostDetailsPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Regsiter />,
      },

      {
        path: "membership",
        element: <PrivateRoute><Membership /></PrivateRoute>,
      },
      {
        path: "all-tag",
        element: <AllTag />,
      },
       {
         path: 'forbidden',
         element: <Forbidden></Forbidden>
      },
    ],
  },

  // Dashboard routes
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      // User Dashboard
      {
        index: true,
        element: <DashboardHome />,
      },

      {
        path: "my-profile",
        element: <PrivateRoute><MyProfile /></PrivateRoute>,
      },

      {
        path: "add-post",
        element: <PrivateRoute><AddFrom /></PrivateRoute>,
      },
      {
        path: "my-post",
        element: <PrivateRoute><MyPost /></PrivateRoute>,
      },
      {
        path: "comments/:postId",
        element: <PrivateRoute><Coomentsuserdas /></PrivateRoute>,
      },

      // Admin-only routes
      {
        path: "make-admin",
        element: <AdminRoute><ManageUsers /></AdminRoute>,
      },
      {
        path: "admin-profile",
        element: <AdminRoute><AdminProfile /></AdminRoute>,
      },
      {
        path: "makeAnnouncement",
        element: <AdminRoute><MakeAnnouncement /></AdminRoute>,
      },
      {
        path: "reportcommant",
        element: <AdminRoute><ReportComant /></AdminRoute>,
      },
    ],
  },
]);
