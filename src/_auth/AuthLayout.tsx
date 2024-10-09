import { Image } from 'antd'
import { Outlet } from 'react-router-dom'
import BgImg from "../../public/assets/img/bg-auth.png"
export default function AuthLayout() {
  return (
    <div className='w-full h-screen flex'>
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
      <section className="w-1/2 flex justify-center self-center">
        <Outlet/>
      </section>
    </div>
  )
}
