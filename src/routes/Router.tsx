import { createBrowserRouter } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import Category from "@/Components/auth/Category"
import SignUp2 from "@/Components/auth/SignUp2"
import LoginPage from "@/Components/auth/SignIn"
import SignupPage from "@/Components/auth/SignUpPage1"
import SignupPage2 from "@/Components/auth/SIgnUpPage2"
import SignupPage3 from "@/Components/auth/SignUpPage3"
import SignUpPage4 from "@/Components/auth/SignUpPage4"
import { SocialFeed } from "@/Components/socialFeed/SocialFeed"
import Profile from "@/Components/profile/Profile"

export const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage/>,
    },
    {path : "/category" , element : <Category/>},
    {path : "/signup", element : <SignUp2/>},
    {path : "/signin" , element : <LoginPage/>},
    {path : "/signup/student/profile/name/:id", element:<SignupPage/>},
    {path : "/signup/student/profile/profesional-details/:id", element:<SignupPage2/>},
    {path : "/signup/student/profile/location/:id" , element : <SignupPage3/>},
    {path : "/signup/student/profile/profile-picture/:id", element : <SignUpPage4/>},
    {path : "/feed" , element : <SocialFeed/>},
    {path : "/profile/:id", element : <Profile/>}
  
  ])