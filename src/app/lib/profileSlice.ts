import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: ProfileState = {
  nickname: "",
  age: 7,
  gender: "",
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState>) => {
      state.nickname = action.payload.nickname
      state.age = action.payload.age
      state.gender = action.payload.gender
    },
  },
})

// Action creators are generated for each case reducer function
export const { setProfile } = profileSlice.actions

export default profileSlice.reducer