import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { FcGoogle } from 'react-icons/fc';
import Modal from '../components/Modal2';  // Import Modal component

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [modalMessage, setModalMessage] = useState(''); // Message to display in the modal
  const [modalTitle, setModalTitle] = useState(''); // Title for the modal
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          const userRole = userDoc.data().role;
          if (userRole === 'Reader') {
            navigate('/');
          } else if (userRole === 'Writer') {
            navigate('/admin');
          } else if (userRole === 'RJ') {
            navigate('/audio');
          } else {
            setModalTitle('Invalid Role');
            setModalMessage('The role assigned to your account is invalid.');
            setShowModal(true);
          }
        } else {
          setModalTitle('No User Data');
          setModalMessage('No user data found in Firestore.');
          setShowModal(true);
        }
      } else {
        setModalTitle('Email Not Verified');
        setModalMessage('Check Your Mailbox For Email Verification.');
        setShowModal(true);
      }
    } catch (error) {
      setModalTitle('Login Failed');
      setModalMessage('Login failed: ' + error.message);
      setShowModal(true);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          const userRole = userDoc.data().role;
          if (userRole === 'Reader') {
            navigate('/');
          } else if (userRole === 'Writer') {
            navigate('/admin');
          } else if (userRole === 'RJ') {
            navigate('/audio');
          } else {
            setModalTitle('Invalid Role');
            setModalMessage('The role assigned to your account is invalid.');
            setShowModal(true);
          }
        } else {
          setModalTitle('No User Data');
          setModalMessage('No user data found in Firestore.');
          setShowModal(true);
        }
      } else {
        setModalTitle('Sign-In Failed');
        setModalMessage('Google sign-in failed.');
        setShowModal(true);
      }
    } catch (error) {
      setModalTitle('Google Sign-In Failed');
      setModalMessage('Google sign-in failed: ' + error.message);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div className="md:mt-10 flex flex-col items-center justify-center w-full">
      <form onSubmit={handleLogin} className="flex flex-col items-center justify-center border px-6 py-12 bg-white shadow-lg ">
        <h1 className="text-xl font-bold mb-4 w-full cinzel-decorative-bold">Bookify</h1>
        <p className="w-full text-3xl mulish-bold">Hi, Welcome Back</p>
        <p className="mb-4 w-full text-gray-500 text-sm mulish-light">
          Login to your account to continue
        </p>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mb-4 border rounded px-2 py-2 w-full flex items-center gap-x-2 justify-center"
        >
          <FcGoogle size={30} />
          Sign In with Google
        </button>
        <div className="mb-6 w-full text-gray-500 text-xs text-center mulish-light flex justify-center items-center gap-x-2">
          <div className="h-[0.1px] w-full bg-gray-300"></div>
          <p className="text-nowrap">or SignUp with email</p>
          <div className="h-[0.1px] w-full bg-gray-300"></div>
        </div>
        <input
          className="mb-4 border rounded px-3 py-2 w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mb-4 border rounded px-3 py-2 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="mb-4 border rounded px-3 py-2 w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white" type="submit">
          Login
        </button>
        <Link
        to="/signup"
        className="  text-gray-500  px-4 py-2 text-sm mulish-regular"
      >
        Don't have an account?<span className='text-blue-600'>Sign Up </span> 
      </Link>
      </form>

     

      {/* Modal */}
      <Modal show={showModal} onClose={closeModal} title={modalTitle} message={modalMessage} />
    </div>
  );
};

export default Login;
