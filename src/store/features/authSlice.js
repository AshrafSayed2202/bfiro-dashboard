import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Update base URL to point to your PHP backend
const baseURL = import.meta.env.VITE_BASE_URL;

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseURL + "actions/admin/users/me.php",
        {}, // Empty body since it's just checking the token cookie
        {
          withCredentials: true, // Crucial: sends the admin_token cookie
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Backend returns: { user: { id, email, name, status } }
      if (response.data.user) {
        return response.data.user;
      } else {
        return rejectWithValue("No user data received");
      }
    } catch (error) {
      // Handle 401, invalid token, etc.
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized or invalid token");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Optional: Add a logout reducer if you want to clear user manually
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload || "Failed to authenticate";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
