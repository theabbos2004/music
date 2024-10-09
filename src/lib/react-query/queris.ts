import { useMutation, useQuery } from "react-query"
import { addMusicToAdvertising, addMusicToAlbum, createAccount, createAdvertising, createAlbum, createMusic, createSaveMusic, createUserAccount, createViewsMusic, deleteAdvertising, deleteCollectionFile, getAccount, getAdvertising, getAlbums, getCurrentUser,  getFilterMusic,   getMusics,   getSaveMusic,   getUser,   likeMusic,   saveMusic,   signInAccount, signOutAccount, updateAccount, updateMusic, viewedMusic} from "../AppWrite/api"

import { ICreateAlbum, IDelAdvertising, IFORMEDITPROFILE, IGetUser, IMusicSave, IMusicUpdate, IMusicViews, INewAcount, INewAdvertising, INewMusicAdvertising, INewUser, IUserSession } from "../../types"
import { QUERY_KEYS } from "./queryKeys"

// ==================================== AUTH QUERIES

export const useCreateUserAccount=()=>{
    return useMutation({
        mutationFn:(user:INewUser)=> createUserAccount(user)
    })
}

export const useCreateAccount=()=>{
    return useMutation({
        mutationFn:(user:INewAcount)=> createAccount(user)
    })
}

export const useSignInAccount=()=>{
    return useMutation({
        mutationFn:(user:IUserSession)=>signInAccount(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
      mutationFn: signOutAccount,
    });
}

export const useGetAccount=()=>{
    return useMutation({
        mutationFn:getAccount
    })
}
export const useGetUser=()=>{
    return useMutation({
        mutationFn:({userId}:IGetUser)=>getUser({userId})
    })
}
export const usegetCurrentUser=()=>{
    return useMutation({
        mutationFn:getCurrentUser
    })
}
export const usegetCurrentUserQuery=()=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_CURRENT_ACCOUNT],
        queryFn:getCurrentUser
    })
}

export const useUpdateAccount=()=>{
    return useMutation({
        mutationFn:({email,name,user,bg_img_url,imageUrl,gender,newPassword,password,liked_musics,saved}:IFORMEDITPROFILE)=>updateAccount({email,name,user,bg_img_url,imageUrl,gender,newPassword,password,liked_musics,saved})
    })
}

// ==================================== Music  QUERIES

export const useCreateMusic=()=>{
    return useMutation({
        mutationFn:createMusic
    })
}

export const useLikeMusic=()=>{
    return useMutation({
        mutationFn:({musicId,likes}:{musicId:string,likes:string[]})=>likeMusic(musicId,likes)
    })
}



export const useGetMusics=()=>{
    return useMutation({
        mutationFn:getMusics
    })
    }
export const useGetSaveMusic=()=>{
    return useMutation({
        mutationFn:({saveId}:IMusicSave)=>getSaveMusic({saveId})
    })
    }
export const useCreateSaveMusic=()=>{
    return useMutation({
        mutationFn:({userId}:IMusicSave)=>createSaveMusic({userId})
    })
    }
    export const useSaveMusic=()=>{
        return useMutation({
            mutationFn:({musics,saveId}:IMusicSave)=>saveMusic({musics,saveId})
        })
    }
    export const useCreateViewMusic=()=>{
        return useMutation({
            mutationFn:({userId}:IMusicViews)=>createViewsMusic({userId})
        })
        }
    export const useViewedMusic=()=>{
        return useMutation({
            mutationFn:({musics,viewId}:IMusicViews)=>viewedMusic({musics,viewId})
        })
        }
export const useUpdateMusic=()=>{
    return useMutation({
        mutationFn:({musicId,atribut}:IMusicUpdate)=>updateMusic({musicId,atribut})
    })
    }
    // ==================================== Music ADVERTISING  QUERIES
    export const useCreateAdvertising=()=>{
        return useMutation({
        mutationFn:({creator,title,image_url}:INewAdvertising)=>createAdvertising({creator,title,image_url})
    })
    }
    export const useAddMusicToAdvertising=()=>{
        return useMutation({
        mutationFn:({advertisingId,musicList}:INewMusicAdvertising)=>addMusicToAdvertising({advertisingId,musicList})
    })
    }
    export const useDelAdvertising=()=>{
        return useMutation({
        mutationFn:({advertising}:IDelAdvertising)=>deleteAdvertising({advertising})
    })
    }

    export const useGetAdvertising=()=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_ADVERTISING_MUSICS],
        queryFn:getAdvertising
    })
    }
        
// ==================================== ALBUM  QUERIES

export const useCreateAlbum=()=>{
    return useMutation({
        mutationFn:(album:ICreateAlbum)=>createAlbum(album)
    })
}   

export const useGetAlbums=()=>{
    return useMutation({
        mutationFn:getAlbums
    })
    }

export const useAddMusicToAlbum=()=>{
    return useMutation({
        mutationFn:({albumId,musics}:{albumId:string,musics:any})=>addMusicToAlbum(albumId,musics)
    })
}   
// ================================= FILTER MUSIC

export const useGetFilterMusic=()=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_FILTER_MUSICS],
        queryFn:getFilterMusic
    })
}
// ================================= GLOBAL FUNC
export const useDelColDoc=()=>{
    return useMutation({
        mutationFn:({collectionId,doccumentId}:{collectionId:string,doccumentId:string})=>deleteCollectionFile({collectionId,doccumentId})
    })
}