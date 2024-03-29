import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

import Input from '../../base/Input';
import Button from '../../base/Button';
import Footer from '../../base/Footer';

import logo from '../../../assets/img/logo.png';

import { validateLogin } from '../../../utils/validation';
import { ROUTES } from '../../../utils/constants/routes';

import styles from './index.module.scss';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [isSucceed, setIsSucceed] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== '' && token !== null) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const isFormValid = Object.values(inputs).every(el => !!el);

  const handleInputChange = (value, valueKey) => {
    setInputs(prev => ({ ...prev, [valueKey]: value }));
    setIsSucceed(prev => ({ ...prev, [valueKey]: false }));
    setErrors(prev => ({ ...prev, [valueKey]: '' }));
  };

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', {
        email: inputs.email,
        password: inputs.password,
      });

      const userData = response.data.user;
      console.log('userData', userData);
      login(userData);

      await validateLogin({
        data: inputs,
        onSuccess: () => {
          setErrors({});
          setIsSucceed({ email: true, password: true });

          alert(`Hi ${userData.name}, you're logged in.`);
        },
        onError: validationErrors => {
          setErrors({ ...validationErrors });
          setIsSucceed({ email: false, password: false });

          alert('Email or password do not match');
        },
      });

      setIsSucceed(true);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setIsSucceed(false);
      if (error.response?.data?.errors !== undefined) {
        setErrors(error.response.data.errors);
      }
      if (error.response?.data?.error !== undefined) {
        setErrors(error.response.data.error);
      }
      if (error.response?.status === 401) {
        alert('User not found or incorrect password');
      }
    }
  };

  const handleForgotPasswordClick = () => {
    alert('Forgot password action is called!');
  };

  return (
    <section className={styles.container}>
      <div className={styles.formContainer}>
        <div>
          <div className={styles.logo}>
            <img src={logo} alt='logo' />
          </div>

          <p className={styles.title}>Sign in</p>

          <p className={styles.heading}>
            Don’t have an account?
            <Link
              to={`${ROUTES.ROOT}${'register'}`}
              className={styles.headingLink}
            >
              {' '}
              Sign up now
            </Link>
          </p>

          <form className={styles.form} onSubmit={handleLogin}>
            <Input
              value={inputs.email}
              valueKey='email'
              label='Email'
              name='email'
              errorMessage={errors.name}
              isSucceed={isSucceed.name}
              onChange={handleInputChange}
            />

            <Input
              value={inputs.password}
              valueKey='password'
              label='Password'
              type='password'
              name='password'
              action={{
                text: 'Forgot your password?',
                onClick: handleForgotPasswordClick,
              }}
              errorMessage={errors.password}
              isSucceed={isSucceed.password}
              onChange={handleInputChange}
            />

            <Button label='Sign in' type='submit' isDisabled={!isFormValid} />
          </form>
        </div>

        <Footer />
      </div>
    </section>
  );
};

export default LoginPage;
