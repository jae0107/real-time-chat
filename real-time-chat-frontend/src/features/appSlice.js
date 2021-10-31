import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        channelId: null,
        channelName: null
    },
    reducers: {
        setChannelInfo: (state, action) => {
            state.channelId = action.payload.channelId
            state.channelName = action.payload.channelName
        }
    },
});

export default appSlice.reducer;
