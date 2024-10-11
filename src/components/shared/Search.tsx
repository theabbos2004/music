import { Flex } from 'antd';
import { memo } from 'react';
import { IoCloseOutline} from 'react-icons/io5';

const Search=({event}:{event:{onchageSearch:any,closeSearch:any}}) => (
  <div 
    className='group flex w-52 h-8 sm:h-9 bg-white dark:bg-[var(--color-blue)] rounded-md overflow-hidden border-gray-[var(--color-blue-1)] border-[0.1rem] text-gray-400 hover:border-[var(--color-green)]'>
    <input 
      name='searchWord'
      type='text' 
      className='h-full w-[85%] p-0 m-0 bg-transparent outline-none px-3 text-gray-800 dark:text-gray-100 text-center'
      placeholder="input search text"
      onChange={(e)=>{event?.onchageSearch(e.target.value||"")}}
      />
      <Flex className='sm:hidden w-[15%] justify-center items-center  group-hover:border-[var(--color-green)] border-gray-300 border-l-[0.1rem] text-[var(--color-blue-1)]'>
         <IoCloseOutline
            className={`text-xl cursor-pointer`}
            onClick={()=>{event?.closeSearch()}}
          />
      </Flex>
  </div>
);

export default memo(Search);