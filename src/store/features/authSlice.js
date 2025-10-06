import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/';

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
    const response = await axios.get(baseURL + 'actions/users/current.php', { withCredentials: true });
    return response.data.user; // Assume response structure
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null, // Mock: { name: 'Admin', email: 'admin@example.com', image: '', roles: [65] }
        status: 'idle',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export default authSlice.reducer;