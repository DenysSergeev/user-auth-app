import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

import styles from './index.module.scss';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      getUser();
    }
  }, [navigate]);

  const getUser = () => {
    axios
      .get('/api/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(response => {
        user.setUser(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const logoutAction = () => {
    axios
      .post(
        '/api/logout',
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )
      .then(response => {
        localStorage.setItem('token', '');
        logout();
        navigate('/');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getWelcomeMessage = () => {
    const userNameFromSession = user ? user.name : '';
    const userNameFromStorage = localStorage.getItem('userName');

    return `Welcome, ${userNameFromSession || userNameFromStorage || 'Guest'}!`;
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <a className={styles.navbarBrand} href='#'>
          Dashboard
        </a>
        <a
          onClick={() => logoutAction()}
          className={styles.navbarBrand}
          href='#'
        >
          Logout
        </a>
      </nav>
      <div className={styles.welcomeContainer}>
        <h2>{getWelcomeMessage()}</h2>
      </div>
    </div>
  );
}

export default Dashboard;
