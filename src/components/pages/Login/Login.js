import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Input from "../../base/Input";
import Button from "../../base/Button";
import Footer from "../../base/Footer";

import logo from "../../../assets/img/logo.png"

import { validateLogin } from "../../../utils/validation";
import { ROUTES } from "../../../../src/utils/constants/routes";

import styles from "./Login.module.scss";

const LoginPage = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isSucceed, setIsSucceed] = useState({
    email: false,
    password: false,
  });

  const isFormValid = useMemo(() => {
    const inputsLength = Object.values(inputs).length;
    const inputsWithAnyValue = Object.values(inputs).filter(
      (el) => !!el
    ).length;

    return inputsLength === inputsWithAnyValue;
  }, [inputs]);

  const handleInputChange = (value, valueKey) => {
    setInputs((prev) => ({ ...prev, [valueKey]: value }));
    setIsSucceed((prev) => ({ ...prev, [valueKey]: false }));
    setErrors((prev) => ({ ...prev, [valueKey]: "" }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    validateLogin({
      data: inputs,
      onSuccess: () => {
        setErrors({});
        setIsSucceed({ email: true, password: true });
        alert("You are logged in!");
      },
      onError: (errors) => {
        setErrors({ ...errors });
        setIsSucceed({ email: false, password: false });
      },
    });
  };

  const handleForgotPasswordClick = () => {
    alert("Forgot password action is called!");
  };

  return ( 
    <section className={styles.container}>
      <div className={styles.formContainer}>
        <div>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>

          <p className={styles.title}>Sign in</p>

          <p className={styles.heading}>
            Don’t have an account?
            <Link to={ROUTES.ROOT} className={styles.headingLink}>
              {" "}
              Sign up now
            </Link>
          </p>

          <form className={styles.form} onSubmit={handleLogin}>
            <Input
              value={inputs.email}
              valueKey="email"
              label="Email"
              name="email"
              errorMessage={errors.email}
              isSucceed={isSucceed.email}
              onChange={handleInputChange}
            />

            <Input
              value={inputs.password}
              valueKey="password"
              label="Password"
              type="password"
              name="password"
              action={{
                text: "Forgot your password?",
                onClick: handleForgotPasswordClick,
              }}
              errorMessage={errors.password}
              isSucceed={isSucceed.password}
              onChange={handleInputChange}
            />

            <Button label="Sign in" type="submit" isDisabled={!isFormValid} />
          </form>
        </div>

        <Footer />
        </div>  
    </section>
  );
};

export default LoginPage;