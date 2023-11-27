import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoLogin = () => {
    return dispatch(sessionActions.login({
      credential: 'Demo-lition',
      password: 'password'
    }))
      .then(closeModal)
  }

  return (
    <>
      <div id='login-form-div'>
        <form id='login-form' onSubmit={handleSubmit}>
        <h1>Log In</h1>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder='Username or Email'
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
          />
          {errors.credential && (
            <p className='login-error'>{errors.credential}</p>
          )}
          <button
            id='login-button'
            type="submit"
            disabled={credential.length < 4 || password.length < 6}
          >Log In</button>
          <button
            onClick={handleDemoLogin}
          >Log in as Demo User</button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
