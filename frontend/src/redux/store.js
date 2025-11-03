import { configureStore } from "@reduxjs/toolkit";
import userSlicer from "./userSlice.js";

export const store= configureStore({
    reducer:{
        user:userSlicer
    }

});
export default store;