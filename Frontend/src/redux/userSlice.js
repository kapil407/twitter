import {createSlice} from '@reduxjs/toolkit'


const userSlice=createSlice({
    name:"user",        // name of slice 
    initialState:{
        user:null,
        otherUsers:null,
        profile:null
    },
    reducers:{
    // multiple Actions
    getUser:(state,action)=>{
            state.user=action.payload
    },
    getOtherUsers:(state,action)=>{
            state.otherUsers=action.payload;
    },
    getMyProfile:(state,action)=>{
        
        state.profile=action.payload;
    }
}
});
export const {getUser,getOtherUsers,getMyProfile}=userSlice.actions;
export default userSlice.reducer;
