import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

const Test = () => {
  useEffect(() => {
    const auth = getAuth();

    // This listens for any change in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid; // This is the user ID (UID)
        console.log(uid);
      } else {
        // No user is signed in
        console.log("No user is signed in.");
      }
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return <div>Your Component</div>;
};

export default Test;
