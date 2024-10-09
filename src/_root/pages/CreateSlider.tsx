import { Col} from "antd";
import { CreateSliderComp} from "../../components";
import { memo, useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useMainContext } from "../../contexts/MainContext";
import { usegetCurrentUserQuery, useGetUser } from "../../lib/react-query/queris";
import { appwriteConfig, client } from "../../lib/AppWrite/config";
import { RootState } from "../../redux/store";

function  CreateSlider() {
    const { openNotification } = useMainContext()
    const {data:currentUser}=usegetCurrentUserQuery()
    const {mutateAsync:getUser}=useGetUser()
    const { isPlaying , activeSong , currentIndex} = useSelector((state:RootState) => state?.player);
    const [user,setUser]=useState<{musics_list:any,albums:any}>()
    useEffect(()=>{
      if(currentUser?.data){
        getUserFunc()
        const unSubscribeMusicCol=client.subscribe([
          `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.musicsAdvertisingCollectionId}.documents`
        ], () => {
            getUserFunc()
        });
        return ()=>{
            unSubscribeMusicCol()
        }
      }
    },[currentUser])

    const getUserFunc=async ()=>{
        try{
            const getUserRes=await getUser({userId:currentUser?.data?.$id})
            if(getUserRes.error){
                throw new Error(getUserRes.error)
            }
            setUser(getUserRes?.data)
        }
        catch(error){
            openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
        }
    }
    return (
        <Col className="min-h-[100vh] mt-[3.5rem] p-4 dark:bg-[var(--dark-bg-blue)] dark:text-white">
            <CreateSliderComp user={user} song={{isPlaying , activeSong , currentIndex}} />
        </Col>
    )
}
export default  memo(CreateSlider)