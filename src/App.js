import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ROUTES } from './utils/constants/routes';
import { AuthProvider } from './context/AuthContext';

import LoginPage from './components/pages/Login';
import Registration from './components/pages/Registration';
import Dashboard from './components/pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path={`${ROUTES.ROOT}${'register'}`}
            exact
            element={<Registration />}
          ></Route>
          <Route path={ROUTES.ROOT} element={<LoginPage />}></Route>
          <Route
            path={`${ROUTES.ROOT}${'dashboard'}`}
            element={<Dashboard />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
