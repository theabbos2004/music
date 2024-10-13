// ========================= NOTIFICATION
import { NotificationArgsProps } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import { Dispatch, ReactElement, SetStateAction } from "react";
export type NotificationPlacement = NotificationArgsProps['placement'];
// ========================= CONTEXT
export type IThemeContextType = {
  theme:string
}
export type IAuthContextType = {
  user: IUser | null;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  checkAuthUser: () => Promise<{data?:any,error?:any}>;
};
export type IContextType={
  theme:"light"|"dark",
  setTheme:Dispatch<SetStateAction<"light"|"dark">>,
  collapsed:{collapsed?:boolean,show?:boolean},
  setCollapsed:Dispatch<SetStateAction<{collapsed:boolean,show:boolean}>>,
  collapsedSetting:boolean,
  setCollapsedSetting:Dispatch<SetStateAction<boolean>>,
  contextHolder:ReactElement,
  api:NotificationInstance,
  openNotification: (params: { placement: NotificationPlacement; description: string,pauseOnHover?:boolean,icon:ReactElement}) => void,
  searchWord:string,
  setSearchWord:Dispatch<SetStateAction<string>>
}
// ========================= FORM
export type IFORMEDITPROFILE={
  $id?:string,
  bg_img_url?:string,
  name?:string,
  imageUrl?:string,
  bio?:string,
  contact?:string,
  date?:string,
  gender?:string,
  user?:any,
  email?:string,
  password?:string,
  newPassword?:string,
  liked_musics?:any[],
  saved?:any[]
};
// ========================= USER
export type IUser={
    id: string,
    name: string,
    username: string,
    email: string,
    imageUrl: string,
    bio: string,
    liked_musics?:any[],
    saved?:any
  };
  export type INewUser = {
    accountId:string;
    email: string;
    name : string;
    gender:string,
  };
  export type INewAcount = {
    email: string;
    name?: string;
    password: string;
  };
  export type INewUserDB = {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    gender: string;
  }
  export type IUserSession={ 
    email: string; 
    password: string;
  }
  export type IGetUser={
    userId:string
  }
// ========================= MUSIC

export type INewMusic={
  creator:string
  title:string,
  singer:string,
  image_url:string|undefined,
  music_url:string|undefined,
  albums:null | [string] | undefined
}

export type IMusicAlbum={
  id: number;
  title: string;
  singer: string;
  view: number;
  like: number;
  drop:{
    id: number;
    title: string;
    singer: string;
    music_url: string;
    view: number;
    like: number;
  }[]
}
export type IMusicSave={
  userId?:string,
  musics?:string[],
  saveId?:string,
}
export type IMusicViews={
  userId?:string,
  musics?:string[],
  viewId?:string,
}
export type IMusicUpdate={
  musicId:string,
  atribut:any
}


// ========================= MUSIC ADVERTISING
export type INewAdvertising={
  creator:string
  title:string,
  image_url:any
}
export type INewMusicAdvertising={
  advertisingId:string,
  musicList:any[]
}
export type IDelAdvertising={
  advertising:any
}
// ========================= MUSIC FILTER

export type IMusicFilter={
  id:string,
  title:string,
  filter?:()=>void,
  scroll?:{to:string}
}


// ========================= NEW MUSIC
export type IActiveSong={
  music_url?:any,
  image_url?:any,
  title?:string,
  singer?:string
}

// ========================= NEW MUSIC
export type ICreateAlbum={
  creator?:any,
  image_url:any,
  title:string,
  singers:string,
}