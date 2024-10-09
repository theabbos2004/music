import { Route, Routes } from "react-router-dom"
import { Albums, Home, Liked, Marked, PriviteS, Profile, ProfileS } from "./_root/pages"
import CreateSlider from "./_root/pages/CreateSlider"
import AuthLayout from "./_auth/AuthLayout"
import { SignInForm, SignUpForm, SignUpStep2Form } from "./_auth"
import { useMainContext } from "./contexts/MainContext"
import { ProfileLayout, RootLayout, SettingLayout } from "./_root/Layouts"

function App() {
  const {contextHolder}=useMainContext()
  return (
    <>
      <Routes>
        <Route path="/" element={<RootLayout/>}>
          <Route index element={<Home/>}/>
          <Route path="slider" element={<CreateSlider/>}/>
          <Route path="liked" element={<Liked/>}/>
          <Route path="marked" element={<Marked/>}/>
          <Route path="albums" element={<Albums/>}/>
          <Route path="user/:id" element={<ProfileLayout/>}>
            <Route index element={<Profile/>}/>
            <Route path="setting" element={<SettingLayout/>}>
              <Route index path="profile" element={<ProfileS/>}/>
              <Route path="privite" element={<PriviteS/>}/>
            </Route>
          </Route>
        </Route>
        <Route path='/' element={<AuthLayout/>}>
            <Route path='sign-up' element={<SignUpForm/>}/>
            <Route path='sign-up-step-2' element={<SignUpStep2Form/>}/>
            <Route path='sign-in' element={<SignInForm/>}/>
        </Route>
      </Routes>
      {contextHolder}
    </>
  )
}

export default App
