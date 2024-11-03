import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useNavigate, useParams } from 'react-router-dom';
import firebaseConfig from '../pages/firebaseConfig';
import { MdOutlineEdit, MdLogout, MdAdd } from "react-icons/md";
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const WriterProfile = () => {
  const { id } = useParams();
  const [writerName, setWriterName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [aboutAuthor, setAboutAuthor] = useState('');
  const [socialHandles, setSocialHandles] = useState([{ platform: '', url: '' }]);
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setWriterName(user.displayName);
        setNewName(user.displayName);
        await fetchWriterProfile(user.uid);
      }
    });
    return () => unsubscribe();
  }, [id]);

  const fetchWriterProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'writers', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setWriterName(userData.name);
        setProfilePic(userData.profilePic);
        setAboutAuthor(userData.aboutAuthor || '');

        if (Array.isArray(userData.socialHandles)) {
          setSocialHandles(userData.socialHandles);
        } else {
          setSocialHandles([{ platform: '', url: '' }]);
        }
      }
    } catch (err) {
      console.error('Failed to load writer profile:', err);
      setSocialHandles([{ platform: '', url: '' }]);
    }
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  const handleChangeProfile = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const writerId = user.uid;
    const writerDocRef = doc(db, 'writers', writerId);

    try {
      let downloadURL = profilePic;
      if (profileImageFile) {
        const storageRef = ref(storage, `profileImages/${writerId}`);
        const uploadTask = uploadBytesResumable(storageRef, profileImageFile);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error('Error uploading image:', error);
          },
          async () => {
            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setProfilePic(downloadURL);
          }
        );
      }

      await setDoc(writerDocRef, {
        name: newName,
        profilePic: downloadURL,
        aboutAuthor,
        socialHandles
      }, { merge: true });

      setWriterName(newName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSocialHandleChange = (index, field, value) => {
    const updatedHandles = [...socialHandles];
    updatedHandles[index][field] = value;
    setSocialHandles(updatedHandles);
  };

  const addSocialHandle = () => {
    setSocialHandles([...socialHandles, { platform: '', url: '' }]);
  };

  const removeSocialHandle = (index) => {
    const updatedHandles = socialHandles.filter((_, i) => i !== index);
    setSocialHandles(updatedHandles);
  };

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="px-6 py-8 md:px-10 md:py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl flex justify-center mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
          <div className="flex items-center md:items-start md:mr-6">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="rounded-full h-32 w-32 object-cover border-4 border-indigo-500" />
            ) : (
              <div className="rounded-full h-32 w-32 bg-gray-200 border-4 border-indigo-500"></div>
            )}
            <div className="ml-6 mt-4 md:mt-0 text-center md:text-left">
              <h2 className="text-4xl font-bold text-gray-800 flex items-center">
                {writerName}
                <MdOutlineEdit  
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline cursor-pointer ml-2 text-indigo-500 hover:text-indigo-700 transition duration-150"
                />
              </h2>
              {isEditing ? (
                <div className="flex flex-col mt-4 space-y-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    value={aboutAuthor}
                    onChange={(e) => setAboutAuthor(e.target.value)}
                    placeholder="About Author"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  
                  {socialHandles.map((handle, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={handle.platform}
                        onChange={(e) => handleSocialHandleChange(index, 'platform', e.target.value)}
                        placeholder="Platform (e.g., Twitter)"
                        className="w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={handle.url}
                        onChange={(e) => handleSocialHandleChange(index, 'url', e.target.value)}
                        placeholder="URL"
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button onClick={() => removeSocialHandle(index)} className="text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </div>
                  ))}
                  <button onClick={addSocialHandle} className="flex items-center mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150">
                    <MdAdd className="mr-2" /> Add Social Link
                  </button>
                  <button onClick={handleChangeProfile} className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150">
                    Update Profile
                  </button>
                </div>
              ) : (
                <div className="mt-4 text-gray-600">
                  <div className="flex flex-col">
                    {socialHandles.map((handle, index) => (
                      <a key={index} href={handle.url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700 mb-1 max-w-md">
                        <span className='font-bold text-green-500'>{handle.platform} </span> {handle.url || ' '}
                      </a>
                    ))}
                    <h1 className='text-gray-700 font-bold mt-5 text-xl'>About  </h1>
                    <p className="mb-2 max-w-md ">{aboutAuthor}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterProfile;
