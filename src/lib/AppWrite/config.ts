import { Client, Account, Databases , Storage, Avatars} from 'appwrite';

export const appwriteConfig = {
    url: import.meta.env.VITE_APPWRITE_URL,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,

    musicsAdvertisingStorageId: import.meta.env.VITE_APPWRITE_ADVERTISING_STORAGE_ID,
    musicsStorageId: import.meta.env.VITE_APPWRITE_MUSICS_STORAGE_ID,
    albumsStorageId: import.meta.env.VITE_APPWRITE_ALBUMS_STORAGE_ID,

    userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLECTION_ID,
    musicsCollectionId: import.meta.env.VITE_APPWRITE_MUSIC_COLECTION_ID,
    musicsAdvertisingCollectionId: import.meta.env.VITE_APPWRITE_MUSICS_ADVERTISING_COLECTION_ID,
    albumsCollectionId: import.meta.env.VITE_APPWRITE_MUSIC_ALBUMS_COLECTION_ID,
    savesCollectionId: import.meta.env.VITE_APPWRITE_MUSIC_SAVES_COLECTION_ID,
    viewsCollectionId: import.meta.env.VITE_APPWRITE_MUSIC_VIEWS_COLECTION_ID,
  };

export const client = new Client();

client
    .setEndpoint(appwriteConfig.url)
    .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

export { ID } from 'appwrite';