import React, { useState } from 'react';
import styles from './Login.module.scss';
import Button from 'components/Button';
import { usePermissions } from 'Permissions';

const Login = () => {
  const { login } = usePermissions();
  const [email, setEmail] = useState('');
  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault();
          login(email);
        }}
      >
        <h1>Login</h1>
        <input
          className={styles.input}
          type="text"
          name="email"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input className={styles.input} type="password" name="password" placeholder="password" />
        <Button type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
