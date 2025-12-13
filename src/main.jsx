import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { fetchUser } from './store/features/authSlice'; // Import the action

// Dispatch fetchUser to load the user on app start (calls me.php)
store.dispatch(fetchUser());

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);