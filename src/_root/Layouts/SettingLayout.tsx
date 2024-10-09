import { Flex } from "antd";
import { SettingSideBar } from "../../components/shared";
import { Outlet } from "react-router-dom";
import { useMainContext } from "../../contexts/MainContext";

export default function SettingLayout() {
    const {collapsed}=useMainContext()
  return (
    <Flex className="size-full bg-slate-200 dark:bg-[var(--dark-bg-blue)]">
        <SettingSideBar/>
        <div className={`${collapsed?"w-[calc(100vw-5rem)]":"w-[calc(100vw-10rem)]"}`}>
            <Outlet/>
        </div>
    </Flex>
  )
}
