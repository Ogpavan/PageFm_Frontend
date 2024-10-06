import React, { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import Modal from '../components/Modal2'; // Import the Modal component

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false); // State for agreeing to terms
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [modalMessage, setModalMessage] = useState(''); // Message for modal
  const [modalTitle, setModalTitle] = useState(''); // Title for modal
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setModalTitle('Agreement Required');
      setModalMessage('You must agree to the terms and conditions to sign up.');
      setShowModal(true);
      return;
    }
    try {
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      setModalTitle('Email Verification Sent');
      setModalMessage('A verification email has been sent to your inbox. Please verify your email before logging in.');
      setShowModal(true);

      // Save the user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        role,
      });

      setModalTitle('Sign Up Success');
      setModalMessage('User registered successfully! Please verify your email.');
      setShowModal(true);
      navigate('/login');
    } catch (error) {
      setModalTitle('Sign Up Failed');
      setModalMessage('Signup failed: ' + error.message);
      setShowModal(true);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: user.displayName.split(' ')[0],
        lastName: user.displayName.split(' ').slice(1).join(' '),
        email: user.email,
        role: role || 'Reader', // Default to 'Reader' if not selected
      });

      setModalTitle('Google Sign Up Success');
      setModalMessage('You have successfully signed up with Google!');
      setShowModal(true);
      navigate('/');
    } catch (error) {
      setModalTitle('Google Sign Up Failed');
      setModalMessage('Google sign-up failed: ' + error.message);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false); // Close modal when the user clicks "OK"
  };

  return (
    <div className="md:mt-10 flex flex-col items-center justify-center w-full ">
      <form onSubmit={handleSignUp} className="flex flex-col items-center justify-center border px-6 py-12 bg-white shadow-lg ">
        <h1 className="text-xl font-bold mb-4 w-full cinzel-decorative-bold">Bookify</h1>
        <p className="w-full text-3xl mulish-bold">Hi, Welcome to Bookify</p>
        <p className="mb-4 w-full text-gray-500 md:text-sm text-xs mulish-light">
          Create an account and start enjoying Bookify
        </p>
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="mb-4 border rounded px-2 py-2 w-full flex items-center gap-x-2 justify-center"
        >
          <FcGoogle size={30} />
          Sign Up with Google
        </button>
        <div className="mb-6 w-full text-gray-500 text-xs text-center mulish-light flex justify-center items-center gap-x-2">
          <div className="h-[0.1px] w-full bg-gray-300"></div>
          <p className='text-xs text-gray-700 text-nowrap'>Or sign up with email</p>
          <div className="h-[0.1px] w-full bg-gray-300"></div>
        </div>
        <div className="flex gap-x-2 flex-wrap ">
          <input
            className="mb-4 border rounded px-3 py-2 w-full"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="mb-4 border rounded px-3 py-2 w-full"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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
          placeholder="Password (Min 6 Characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="mb-6 border rounded px-3 py-2 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="Reader">Reader</option>
          <option value="Writer">Writer</option>
          <option value="RJ">RJ</option>
        </select>

        {/* Agree to Terms */}
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="agreeTerms" className="text-xs text-gray-700">
            I agree to the <Link to="/termsandconditions" className="text-blue-600">Terms and Conditions</Link>
          </label>
        </div>

        <button
          className="mb-4 border rounded px-3 py-2 w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white"
          type="submit"
          disabled={!agreeTerms} // Disable button if terms are not agreed
        >
          Sign Up
        </button>
        <Link
          to="/login"
          className="text-gray-500 px-4 py-2 text-sm mulish-regular"
        >
          Already have an account? <span className="text-blue-600">Login Here</span>
        </Link>
      </form>

      {/* Modal */}
      <Modal show={showModal} onClose={closeModal} title={modalTitle} message={modalMessage} />
    </div>
  );
};

export default SignUp;
