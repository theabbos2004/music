import { IoPersonSharp } from 'react-icons/io5'
export default function Profile({IconClassName,classNameBox,imageUrl}:{IconClassName?:string,classNameBox?:string,imageUrl?:string}) {
  return (
    <div
      className={`overflow-hidden rounded-full flex justify-center border-2 items-center bg-cover bg-center ${classNameBox}`} 
      >
        {
          imageUrl?
          <div 
            className={`size-full border-none rounded-full bg-center bg-cover `} 
            style={{backgroundImage:`url(${imageUrl})`}}
            />
          :
          <IoPersonSharp className={`size-full ${IconClassName}`}/>
        }
    </div>
  )
}
