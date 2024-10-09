import { AppwriteException, ID, Query } from "appwrite"
import { account, appwriteConfig, avatars, database, storage } from "./config"
import { ICreateAlbum, IDelAdvertising, IFORMEDITPROFILE, IGetUser, IMusicSave, IMusicUpdate, IMusicViews, INewAcount, INewAdvertising, INewMusic, INewMusicAdvertising, INewUser, INewUserDB, IUserSession } from "../../types"


// ============================== GET USER
export  const getCurrentUser=async ():Promise<{data?:any,error?:any}>=>{
    try{
        const currentAccount = await account.get(); 
        if (!currentAccount) throw Error;
        const currentUser = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );
        if (currentUser.total < 1) {
            signOutAccount()
            throw Error
        }
        return {data:currentUser.documents[0]};
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return { error: error.message }
        } else {
            return { error }
        }
    }
}
export  const getAccount=async ():Promise<{data?:any,error?:any}>=>{
    try{
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;
        return {data:currentAccount};
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return { error: error.message }
        } else {
            return { error }
        }
    }
}
export  const getUser=async ({userId}:IGetUser):Promise<{data?:any,error?:any}>=>{
    try{
        const getUserRes = await database.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        );
        if (!getUserRes) throw Error;
        return {data:getUserRes};
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return { error: error.message }
        } else {
            return { error }
        }
    }
}


// ============================== SIGN UP
export  const createUserAccount=async (user:INewUser):Promise<{data?:any,error?:any}>=>{
    try{
        const avatarUrl = avatars.getInitials(user.name);
        const newUser=await saveUserToDB({
            accountId: user.accountId,
            name: user.name,
            email: user.email,
            imageUrl: avatarUrl,
            gender:user.gender
        })
        if(!newUser) throw Error
        return {data:newUser};
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return { error: error.message }
        } else {
            return { error }
        }
    }
}

export  const createAccount=async (user:INewAcount):Promise<{data?:any,error?:any}>=>{
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );
        if(!newAccount) throw Error
        return {data:newAccount};
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return { error: error.message }
        } else {
            return { error }
        }
    }
}

export  const updateAccount=async ({name,user,bg_img_url,imageUrl,gender,email,password,newPassword,liked_musics,saved}:IFORMEDITPROFILE):Promise<{data?:any,error?:any}>=>{
    try{        
        if(!user.$id){
            throw new Error("must user id")
        }
        if(email && password && email !== user?.email){
            const updateEmailRes = await account.updateEmail(
                email,
                password
            );
            if(!updateEmailRes) throw Error
            email=`${updateEmailRes.email}`
        }
        if(password && newPassword){
            const updatePasswordRes = await account.updatePassword(
                newPassword,
                password
            );
            if(!updatePasswordRes) throw Error
        }
        if(name && name !== user?.name){
            const updateName = await account.updateName(
                `${name}`
            );
            if(!updateName) throw Error
            name=`${updateName.name}`
        }
        if(bg_img_url && bg_img_url !== user?.bg_img_url){
            const uploadStorgebgImgUrlRes=await uploadStorageFile({storageId:appwriteConfig.musicsAdvertisingStorageId,file:bg_img_url})
            if(uploadStorgebgImgUrlRes.error){
                throw new Error(uploadStorgebgImgUrlRes.error)
            }
            const getStorgebgImgUrlRes=await getStorageFile({fileId:uploadStorgebgImgUrlRes.data.$id,storageId:appwriteConfig.musicsAdvertisingStorageId})
            if(getStorgebgImgUrlRes.error){
                throw new Error(getStorgebgImgUrlRes.error)
            }
            bg_img_url=getStorgebgImgUrlRes.data.href
        }
        
        if(imageUrl && imageUrl !== user?.imageUrl){
            const uploadStorgeImageUrlRes=await uploadStorageFile({storageId:appwriteConfig.musicsAdvertisingStorageId,file:imageUrl})
            if(uploadStorgeImageUrlRes.error){
                throw new Error(uploadStorgeImageUrlRes.error)
            }
            const getStorgeImageUrlRes=await getStorageFile({fileId:uploadStorgeImageUrlRes.data.$id,storageId:appwriteConfig.musicsAdvertisingStorageId})
            if(getStorgeImageUrlRes.error){
                throw new Error(getStorgeImageUrlRes.error)
            }
            imageUrl=getStorgeImageUrlRes.data.href
        }

        const updateDB = await updateColDoc(
            appwriteConfig.userCollectionId,
            user?.$id,
            {
                name,
                bg_img_url,
                imageUrl,
                gender,
                email,
                liked_musics,
                saved
            }
        );        
        if(!updateDB) throw Error
        return {data:updateDB};
        
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return { error: error.message }
        } else {
            return { error }
        }
    }
}


export const updateColDoc=async (colId:string,docId:string,atribut:any):Promise<{data?:any,error?:any}>=>{
    try{
        const updateDocRes=await database.updateDocument(
            appwriteConfig.databaseId,
            colId,
            docId,
            {...atribut}
        )
        if(!updateDocRes) throw Error
        return {data:updateDocRes}
    }
    catch(error){
        if(error instanceof AppwriteException ){
            return {error:error.message}
        }
        else{
            return {error}
        }
    }
}
// ============================== SAVE USER TO DB
export const saveUserToDB =async (user:INewUserDB)=>{
    try{
        const newUser=await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )
        if(!newUser) throw Error
        return {newUser}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
            return {error}
          }
    }
}
// ============================== SIGN IN
export  const signInAccount=async (user:IUserSession):Promise<{data?:any, error?:any}>=>{
    try{
        const session = await account.createEmailPasswordSession(user.email, user.password);
        if(!session) throw Error
        return {data:session}
    }
    catch (error) {
        if (error instanceof AppwriteException) {
            return { error: error.message }
        } else {
            return { error }
        }
    }
}


// ============================== SIGN OUT
export async function signOutAccount():Promise<{data?:any, error?:any}>{
    try {
      const session = await account.deleteSession("current");
      return {data:session};
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
        }
        return {error}
    }
  }



















// ============================== ADVERTISING
export const getAdvertising =async ():Promise<{data?:any,error?:any}>=>{
    try{
        
        const musics=await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.musicsAdvertisingCollectionId,
            [Query.orderDesc("$createdAt"),Query.limit(20)]
        )
        if(!musics) throw Error
        return {data:musics}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
        } else {
            return {error}
        }
    }
}

export const createAdvertising =async ({creator,title,image_url}:INewAdvertising):Promise<{data?:any,error?:any}>=>{
    try{
        const newAdvertisingStorge=await storage.createFile(
            appwriteConfig.musicsAdvertisingStorageId,
            ID.unique(),
            image_url
        )
        if(!newAdvertisingStorge) throw Error
        const getImage_url=await getStorageFile({fileId:newAdvertisingStorge.$id,storageId:appwriteConfig.musicsAdvertisingStorageId})
        if(getImage_url.error) {
            throw new Error(getImage_url.error)
        }
        const newAdvertising=await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.musicsAdvertisingCollectionId,
            ID.unique(),
            {
                creator,
                title,
                image_url:getImage_url.data.href,
                image_id_storge:newAdvertisingStorge.$id
            }
        )
        if(!newAdvertising) throw Error
        return {data:newAdvertising}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
            return {error}
          }
    }
}

export const deleteAdvertising =async ({advertising}:IDelAdvertising):Promise<{data?:any,error?:any}>=>{
    try{
        const delAdvertising=await database.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.musicsAdvertisingCollectionId,
            advertising.$id
        )
        if(!delAdvertising) throw Error
        const delAdvertisingStorge=await storage.deleteFile(
            appwriteConfig.musicsAdvertisingStorageId,
            advertising.image_id_storge
        )
        if(!delAdvertisingStorge) throw Error
        return {data:delAdvertisingStorge}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
              return {error}
          }
        }
    }
    
    export const addMusicToAdvertising =async ({musicList,advertisingId}:INewMusicAdvertising):Promise<{data?:any,error?:any}>=>{
        try{
            const newMusicAdvertising=await database.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.musicsAdvertisingCollectionId,
                advertisingId,
                {
                    musics:musicList
                }
            )
            if(!newMusicAdvertising) throw Error
            return {data:newMusicAdvertising}
        }
        catch(error){
            if (error instanceof AppwriteException) {
                return {error:error.message}
              } else {
                return {error}
              }
        }
    }
    
    













// ======================== MUSIC
export const createMusic =async (music:INewMusic):Promise<{data?:any,error?:any}>=>{
    try{
        const Imgfile=await uploadStorageFile({file:music.image_url,storageId:appwriteConfig.musicsStorageId})
        const musicFile=await uploadStorageFile({file:music.music_url,storageId:appwriteConfig.musicsStorageId})
        if(!Imgfile.data || !musicFile.data){
            throw new Error(Imgfile.error || musicFile.error)
        }
        delete music.image_url
        delete music.music_url
        if(!music.albums){
            delete music.albums
        }
        
        const image_id_storge=Imgfile.data.$id
        const music_id_storge=musicFile.data.$id
        const image=await getStorageFile({fileId:image_id_storge,storageId:appwriteConfig.musicsStorageId})
        const get_music_file=await getStorageFile({fileId:music_id_storge,storageId:appwriteConfig.musicsStorageId})
        var image_url=null
        var music_url=null
        if(image.data.href || get_music_file.data.href){
            image_url=image.data.href
            music_url=get_music_file.data.href
        }
        if(!image_url || !music_url){
            deleteStorgeFIle({fileId:image_id_storge,storageId:appwriteConfig.musicsStorageId})
            deleteStorgeFIle({fileId:music_id_storge,storageId:appwriteConfig.musicsStorageId})
            throw new Error(image.error || get_music_file.error)
        }
        let raw={
            ...music,
            image_url,
            music_url,
            image_id_storge,
            music_id_storge
        }
        const newMusic=await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.musicsCollectionId,
            ID.unique(),
            {...raw}
        )
        if(!newMusic) throw Error
        return {data:newMusic}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
            return {error}
          }
    }
}
export const getMusics =async ():Promise<{data?:any,error?:any}>=>{
    try{
        const newMusic=await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.musicsCollectionId,
        )
        if(!newMusic) throw Error
        return {data:newMusic}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
            return {error}
          }
    }
}
export const likeMusic=async (musicId:string,likes:string[]):Promise<{data?:any,error?:any}>=>{
    try{
        const updateMusic=await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.musicsCollectionId,
            musicId,
            {likes}
        )
        if(!updateMusic) throw Error
        return {data:updateMusic}
    }
    catch(error){
        if(error instanceof AppwriteException ){
            return {error:error.message}
        }
        else{
            return {error}
        }
    }
}
export const getSaveMusic=async ({saveId}:IMusicSave):Promise<{data?:any,error?:any}>=>{
    try{
        const updateMusic=await database.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            `${saveId}`,
        )
        if(!updateMusic) throw Error
        return {data:updateMusic}
    }
    catch(error){
        if(error instanceof AppwriteException ){
            return {error:error.message}
        }
        else{
            return {error}
        }
    }
}
export const createSaveMusic=async ({userId}:IMusicSave):Promise<{data?:any,error?:any}>=>{
    try{
        const updateMusic=await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {user:userId}
        )
        if(!updateMusic) throw Error
        return {data:updateMusic}
    }
    catch(error){
        if(error instanceof AppwriteException ){
            return {error:error.message}
        }
        else{
            return {error}
        }
    }
}
export const saveMusic=async ({musics,saveId}:IMusicSave):Promise<{data?:any,error?:any}>=>{
    try{
        const updateMusic=await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            `${saveId}`,
            {musics}
            
        )
        if(!updateMusic) throw Error
        return {data:updateMusic}
    }
    catch(error){
        if(error instanceof AppwriteException ){
            return {error:error.message}
        }
        else{
            return {error}
        }
    }
}
export const createViewsMusic=async ({userId}:IMusicViews):Promise<{data?:any,error?:any}>=>{
    try{
        const updateMusic=await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.viewsCollectionId,
            ID.unique(),
            {user:userId}
        )
        if(!updateMusic) throw Error
        return {data:updateMusic}
    }
    catch(error){
        if(error instanceof AppwriteException ){
            return {error:error.message}
        }
        else{
            return {error}
        }
    }
}
export const viewedMusic=async ({musics,viewId}:IMusicViews):Promise<{data?:any,error?:any}>=>{
    try{
        const updateMusic=await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.viewsCollectionId,
            `${viewId}`,
            {musics}
            
        )
        if(!updateMusic) throw Error
        return {data:updateMusic}
    }
    catch(error){
        if(error instanceof AppwriteException ){
            return {error:error.message}
        }
        else{
            return {error}
        }
    }
}

export const updateMusic=async ({musicId,atribut}:IMusicUpdate):Promise<{data?:any,error?:any}>=>{
    try{
        // const updateMusic=await updateColDoc(appwriteConfig.musicsCollectionId,musicId,{views:atribut})
        const updateMusic=await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.musicsCollectionId,
            musicId,
            {views:atribut}
        )
        if(!updateMusic) throw Error
        return {data:updateMusic}
    }
    catch(error){
        if(error instanceof AppwriteException ){
            return {error:error.message}
        }
        else{
            return {error}
        }
    }
}

// ========================= UPLOAD STORGE
export const uploadStorageFile=async ({storageId,file}:{storageId:any,file:any}):Promise<{data?:any,error?:any}>=>{
    try{
        
        const uploadFileStorge=await storage.createFile(
            storageId,
            ID.unique(),
            file
        )
        if(!uploadFileStorge) throw Error
        return {data:uploadFileStorge}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
            return {error}
          }
    }
}

export const getStorageFile=async ({fileId,storageId}:any):Promise<{data?:any,error?:any}>=>{
    try{
        const newImage = await storage.getFileView(
            storageId,
            fileId
        )
        if(!newImage) throw Error
        return {data:newImage}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
            return {error}
          }
    }
}

export const deleteStorgeFIle=async ({fileId,storageId}:any):Promise<{data?:any,error?:any}>=>{
    try{
        const image_url=await storage.deleteFile(
            storageId,
            fileId
        )
        return {data:image_url}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
            return {error}
          }
    }
}

export const deleteCollectionFile=async ({collectionId,doccumentId}:{collectionId:string,doccumentId:string}):Promise<{data?:any,error?:any}>=>{
    try{
        const data=await database.deleteDocument(
            appwriteConfig.databaseId,
            collectionId,
            doccumentId
        )
        return {data}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
            return {error}
          }
    }
}
// ============================  Album

export const createAlbum=async (album:ICreateAlbum):Promise<{data?:any,error?:any}>=>{
    try{
        const isUploadImgStorageFile=await uploadStorageFile({file:album.image_url,storageId:appwriteConfig.albumsStorageId})
        if(isUploadImgStorageFile.error){
            throw new Error(isUploadImgStorageFile.error)
        }
        delete album.image_url
        const image_id_storge=isUploadImgStorageFile.data.$id
        const imgStorageFile=await getStorageFile({fileId:image_id_storge,storageId:appwriteConfig.albumsStorageId})
        if(imgStorageFile.error) {
            throw new Error(imgStorageFile.error)
        }
        const image_url=imgStorageFile.data.href
        const newMusic=await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.albumsCollectionId,
            ID.unique(),
            {
                ...album,
                image_id_storge,
                image_url
            }
        )
        if(!newMusic) throw Error
        return {data:newMusic}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
            return {error}
          }
    }
}

export const getAlbums =async ():Promise<{data?:any,error?:any}>=>{
    try{
        const albumsList=await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.albumsCollectionId,
        )
        if(!albumsList) throw Error
        return {data:albumsList}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
            return {error}
          }
    }
}

export const addMusicToAlbum =async (albumId:string,musics:any):Promise<{data?:any,error?:any}>=>{
    try{
        const newMusic=await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.musicsCollectionId,
            albumId,
            {
                musics
            }
        )
        if(!newMusic) throw Error
        return {data:newMusic}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
          } else {
            return {error}
          }
    }
}

// ============================ FILTER MUSIC
export const getFilterMusic=async ():Promise<{data?:any,error?:any}>=>{
    try{
        const filterMenu = await [
            {id:"2",title:"Top Like",filter:(musicList:any)=>{
                for (let i = 0; i < musicList.length - 1; i++) {
                    for (let j = 0; j < musicList.length - 1 - i; j++) {
                        if (musicList[j]?.likes?.length < musicList[j + 1]?.likes?.length) {
                            let temp = {...musicList[j]};
                            musicList[j] = musicList[j+1];
                            musicList[j + 1] = temp;
                        }
                    }
                }
                
                return musicList
            }},
            {id:"1",title:"Top Music",filter:(musicList:any)=>{
                    for (let i = 0; i < musicList?.length - 1; i++) {
                        for (let j = 0; j < musicList.length - 1 - i; j++) {
                                if (musicList[j]?.views?.length > musicList[j + 1]?.views?.length) {
                                    let temp = {...musicList[j]};
                                    musicList[j] = {...musicList[j+1]};
                                    musicList[j + 1] = temp;
                                }
                        }
                    }
                    return musicList
            }},
        ]
        if(!filterMenu) throw Error        
        return {data:filterMenu}
    }
    catch(error){
        if (error instanceof AppwriteException) {
            return {error:error.message}
        } else {
            return {error}
        }
    }
}
//     {id:"3",title:"Partner",filter:(musicList:any)=>{
//         return musicList?.filter((music:any)=>music?.partner && music)
// }},