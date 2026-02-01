import { createSlice } from "@reduxjs/toolkit";



const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null,
        currentcurrency:"inr",   

    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
        },
        setCurrentCurrency:(state,action)=>{
            state.currentcurrency=action.payload
        }
}
})
export const {setUserData,setCurrentCurrency}=userSlice.actions
export default userSlice.reducer