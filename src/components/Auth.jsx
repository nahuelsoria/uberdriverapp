import React, { useState, useEffect } from 'react';
import { auth, db } from "../firebase.js"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import '../Auth.css';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [patente, setPatente] = useState('');
  const [nombre, setNombre] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, [user]);

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const signUp = async (e) => {
    e.preventDefault();
    try {
      console.log("Iniciando registro de usuario...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuario creado exitosamente:", userCredential.user.uid);
      
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        nombre,
        patente
      });
      console.log("Información de usuario guardada en Firestore");
    } catch (error) {
      console.error("Error al registrarse:", error);
      // Aquí puedes agregar alguna lógica para mostrar el error al usuario
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="auth">
      {user ? (
        <div>
          <p>Bienvenido, {userData ? userData.nombre : 'Usuario'}</p>
          <button onClick={logout} className="auth__button">Cerrar sesión</button>
        </div>
      ) : (
        isRegistering ? (
          <form onSubmit={signUp}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="auth__input"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="auth__input"
            />
            <input
              type="text"
              value={patente}
              onChange={(e) => setPatente(e.target.value)}
              placeholder="Patente"
              required
              className="auth__input"
            />
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              required
              className="auth__input"
            />
            <button type="submit" className="auth__button">Registrarse</button>
            <button onClick={() => setIsRegistering(false)} className="auth__button">Volver a Iniciar sesión</button>
          </form>
        ) : (
          <form onSubmit={signIn}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="auth__input"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="auth__input"
            />
            <button type="submit" className="auth__button">Iniciar sesión</button>
            <button onClick={() => setIsRegistering(true)} className="auth__button">Registrarse</button>
          </form>
        )
      )}
    </div>
  );
}

export default Auth;