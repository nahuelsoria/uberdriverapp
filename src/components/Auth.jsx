import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import '../Auth.css';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const passwordConditions = [
    { regex: /.{8,}/, text: "Al menos 8 caracteres" },
    { regex: /[A-Z]/, text: "Al menos una letra mayúscula" },
    { regex: /[a-z]/, text: "Al menos una letra minúscula" },
    { regex: /[0-9]/, text: "Al menos un número" },
  ];

  const validatePassword = (password) => {
    const failedConditions = passwordConditions.filter(condition => !condition.regex.test(password));
    return failedConditions.length === 0 ? '' : failedConditions.map(condition => condition.text).join(', ');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        const error = validatePassword(password);
        if (error) {
          setPasswordError(`La contraseña debe cumplir las siguientes condiciones: ${error}`);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setShowForm(false);
      setPasswordError('');
    } catch (error) {
      console.error("Error de autenticación:", error);
      setPasswordError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (auth.currentUser) {
    return (
      <div className="auth">
        <div className="auth__user-info">
          <span>{auth.currentUser.email}</span>
          <button className="auth__button" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth">
      {showForm && <div className="auth__overlay" onClick={() => setShowForm(false)}></div>}
      {showForm ? (
        <form onSubmit={handleAuth} className="auth__form">
          <h3>{isRegistering ? 'Registrarse' : 'Iniciar sesión'}</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          {isRegistering && (
            <div className="auth__password-conditions">
              <p>La contraseña debe cumplir las siguientes condiciones:</p>
              <ul>
                {passwordConditions.map((condition, index) => (
                  <li key={index} className={condition.regex.test(password) ? 'valid' : 'invalid'}>
                    {condition.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {passwordError && <p className="auth__error">{passwordError}</p>}
          <button type="submit" className="auth__button">
            {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
          </button>
          <button type="button" className="auth__button" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
          <button type="button" className="auth__button auth__button--cancel" onClick={() => setShowForm(false)}>
            Cancelar
          </button>
        </form>
      ) : (
        <button className="auth__button" onClick={() => setShowForm(true)}>
          Iniciar sesión / Registrarse
        </button>
      )}
    </div>
  );
}

export default Auth;