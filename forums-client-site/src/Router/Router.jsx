import {
  createBrowserRouter,
} from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Banner from "../Pages/Home/Banner/Banner";
import CreatePostModal from "../Pages/Home/Banner/CreatePost";
import CreatePost from "../Pages/Home/Banner/CreatePost";
import AnnouncementSection from "../Pages/Home/Banner/AnnouncementSection";
import AddAnnouncementForm from "../Pages/Home/Banner/AddAnnouncementForm";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true, 
            Component: Home
        },

        {
          path: '/banner',
          Component: Banner

        },
        {
          path: '/create-post',
          Component:CreatePost
        },

        {
          path: '/announcements-add',
          Component: AddAnnouncementForm

        },
        {

          path: '/announcements',
          Component: AnnouncementSection
        },
        


        {
          path: '/login',
          Component: Login

        },
        {
          path: '/register',
          Component: Register

        },
    ]
  },
]);