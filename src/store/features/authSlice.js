import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await fetch(`${baseUrl}actions/admin/users/me.php`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  const data = await res.json();
  return data.user;
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const res = await fetch(`${baseUrl}actions/admin/users/login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();
    return data.message;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await fetch(`${baseUrl}actions/admin/users/logout.php`, {
    method: "POST",
    credentials: "include",
  });
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "init",
    error: null,
  },
  reducers: {
    // Use this when user downloads something
    incrementTodayDownloads: (state) => {
      if (state.user && typeof state.user.today_downloads === "number") {
        if (state.user.access_yearly !== null) {
          state.user.today_downloads += 1;
        }
      }
    },

    setTodayDownloads: (state, action) => {
      if (state.user) {
        if (state.user.access_yearly !== null) {
          state.user.today_downloads = action.payload;
        }
      }
    },

    resetTodayDownloads: (state) => {
      if (state.user) {
        if (state.user.access_yearly !== null) {
          state.user.today_downloads = 0;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = "failed";
        state.user = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "init";
      });
  },
});
export const {
  incrementTodayDownloads,
  setTodayDownloads,
  resetTodayDownloads,
} = authSlice.actions;
export default authSlice.reducer;
