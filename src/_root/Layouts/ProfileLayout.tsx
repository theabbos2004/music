import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
  return (
    <div className="w-full">
        {<Outlet/>}
    </div>
  )
}
