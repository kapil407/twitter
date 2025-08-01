import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user", // name of slice
  initialState: {
    user: null,
    otherUsers: null,
    profile: null,
    bookmarksIds: null,
      // authUser:null,
      // onlineUsers:null,
  },
  reducers: {
    // multiple Actions
    getUser: (state, action) => {
      state.user = action.payload;
    },
    getOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    getMyProfile: (state, action) => {
      state.profile = action.payload;
    },
    getBookMarksIds: (state, action) => {
      state.bookmarksIds = action.payload;
    },
      //  setAuthUser:(state,action)=>{
      //       state.authUser = action.payload;
      //   },
      //     setOnlineUsers:(state,action)=>{
      //       state.onlineUsers = action.payload;
      //   },

    followingUpdate: (state, action) => {
      if (state.user?.following?.includes(action.payload)) {
        state.user.following = state.user.following.filter((itemId) => {
          return itemId != action.payload;
        });
      } else {
        // follow
        state.user?.following?.push(action.payload);
      }
    },
  },
});
export const {
  getUser,
  getOtherUsers,
  getMyProfile,
  followingUpdate,
  getBookMarksIds,
 
} = userSlice.actions;
export default userSlice.reducer;
