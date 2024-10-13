import { Image } from 'antd'
import { Outlet } from 'react-router-dom'
import BgImg from "../assets/img/bg-auth.png"
export default function AuthLayout() {
  return (
    <div className='w-full h-screen flex dark:bg-[var(--dark-bg-blue)] dark:md:bg-white'>
       <Image
        className='hidden md:block w-1/2 h-full object-cover bg-no-repeat'
        src={BgImg}
        preview={false}
        placeholder={
          <Image
            src={`${BgImg}?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200`}
          />
        }
      />
      <section className="size-full md:w-1/2 flex justify-center items-center self-center">
        <Outlet/>
      </section>
    </div>
  )
}
