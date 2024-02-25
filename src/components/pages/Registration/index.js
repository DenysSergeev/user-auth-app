import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Input from '../../base/Input';
import Button from '../../base/Button';
import Footer from '../../base/Footer';

import logo from '../../../assets/img/logo.png';

import { validateLogin } from '../../../utils/validation';
import { ROUTES } from '../../../utils/constants/routes';

import styles from './index.module.scss';

const RegistrationPage = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isSucceed, setIsSucceed] = useState({
    name: false,
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

  const handleRegistration = async e => {
    e.preventDefault();

    try {
      console.log('Before validation');
      await validateLogin({
        data: inputs,
        onSuccess: () => {
          setErrors({});
          setIsSucceed({ name: true, email: true, password: true });
          alert('You are registered!');
        },
        onError: validationErrors => {
          const formattedErrors = Object.fromEntries(
            Object.entries(validationErrors).map(([key, value]) => [
              key,
              Array.isArray(value) ? value.join(', ') : value,
            ])
          );
          setErrors({ ...formattedErrors });
          setIsSucceed({ name: true, email: false, password: false });
        },
      });

      const response = await axios.post('/api/register', {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
        password_confirmation: inputs.password_confirmation,
      });

      setIsSucceed(true);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', inputs.name);

      navigate('/dashboard');
    } catch (error) {
      setIsSucceed(false);
      if (error.response?.data?.errors !== undefined) {
        const formattedErrors = Object.fromEntries(
          Object.entries(error.response.data.errors).map(([key, value]) => [
            key,
            value.join(', '),
          ])
        );
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.formContainer}>
        <div>
          <div className={styles.logo}>
            <img src={logo} alt='logo' />
          </div>

          <p className={styles.title}>Registration</p>

          <p className={styles.heading}>
            Have already an account?
            <Link to={ROUTES.ROOT} className={styles.headingLink}>
              {' '}
              Login here
            </Link>
          </p>

          <form className={styles.form} onSubmit={handleRegistration}>
            <Input
              value={inputs.name}
              valueKey='name'
              label='Name'
              name='name'
              errorMessage={errors.name}
              isSucceed={isSucceed.name}
              onChange={handleInputChange}
            />

            <Input
              value={inputs.email}
              valueKey='email'
              label='Email'
              name='email'
              errorMessage={errors.email}
              isSucceed={isSucceed.email}
              onChange={handleInputChange}
            />

            <Input
              value={inputs.password}
              valueKey='password'
              label='Password'
              type='password'
              name='password'
              errorMessage={errors.password}
              isSucceed={isSucceed.password}
              onChange={handleInputChange}
            />

            <Input
              value={inputs.password_confirmation}
              valueKey='password_confirmation'
              label='Confirm Password'
              type='password'
              name='password_confirmation'
              errorMessage={errors.password_confirmation}
              isSucceed={isSucceed.password_confirmation}
              onChange={handleInputChange}
            />

            <Button
              label='Register now'
              type='submit'
              isDisabled={!isFormValid}
            />
          </form>
        </div>

        <Footer />
      </div>
    </section>
  );
};

export default RegistrationPage;
