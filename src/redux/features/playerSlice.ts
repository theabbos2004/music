import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IActiveSong } from '../../types';

type IInitialState={ 
  currentSongs: [IActiveSong],
  currentIndex: number,
  isActive: boolean,
  isPlaying: boolean,
  activeSong: IActiveSong,
  musicDuration:number,
  currentTime:number,
  isMusicList:boolean
}
const initialState:IInitialState = {
  currentSongs: [{music_url:null}],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: {},
  musicDuration:0,
  currentTime:0,
  isMusicList:false
}
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveSong: (state, action) => {
      state.currentSongs = action.payload.songs
      state.currentIndex = action.payload.i;
      state.activeSong = action.payload.song
      state.isActive = true;
    },
    playPause: (state, action:PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    nextSong: (state, action) => {
      if (state.currentSongs[action.payload]) {
        state.activeSong = state.currentSongs[action.payload];
        state.currentIndex = action.payload;
        state.isActive = true;
      }
    },

    prevSong: (state, action) => {
      if (state.currentSongs[action.payload]) {
        state.activeSong = state.currentSongs[action.payload];
        state.currentIndex = action.payload;
        state.isActive = true;
      }
    },
    setMusicDuration:(state, action:PayloadAction<number>) => {
      state.musicDuration = action.payload;
    },
    setCurrentTime:(state, action:PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setIsMusicList:(state) => {
      state.isMusicList = !state.isMusicList
    },
  },
});

export const {setActiveSong, playPause , prevSong , nextSong ,setMusicDuration , setCurrentTime , setIsMusicList } = playerSlice.actions;

export default playerSlice.reducer;
