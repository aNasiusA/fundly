import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { type User, onAuthStateChanged } from "firebase/auth";

interface UserProfile {
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  uid: string;
}

export const useFirebaseUser = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    displayName: "",
    email: "",
    phoneNumber: "",
    photoURL: "",
    uid: "",
  });

  const updateUserProfile = (user: User | null) => {
    if (user) {
      setUserProfile({
        displayName: user.displayName ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        photoURL: user.photoURL ?? "",
        uid: user.uid ?? "",
      });
    } else {
      setUserProfile({
        displayName: "",
        email: "",
        phoneNumber: "",
        photoURL: "",
        uid: "",
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, updateUserProfile);

    const handleForceRefresh = () => {
      const currentUser = auth.currentUser;
      updateUserProfile(currentUser);
    };

    window.addEventListener("forceAuthRefresh", handleForceRefresh);

    return () => {
      unsubscribe();
      window.removeEventListener("forceAuthRefresh", handleForceRefresh);
    };
  }, []);

  return userProfile;
};
