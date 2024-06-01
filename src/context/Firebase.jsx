import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { addDoc, collection, getFirestore, getDocs, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBAqdrow9fli2RW7S5-SVnK7mLdYfxNC1o",
  authDomain: "bookify-react-a3893.firebaseapp.com",
  projectId: "bookify-react-a3893",
  storageBucket: "bookify-react-a3893.appspot.com",
  messagingSenderId: "82859830200",
  appId: "1:82859830200:web:a378aeb262ea7824b67d4d",
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
export const fireStore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const firebaseContext = createContext(null);

export const useFirebase = () => useContext(firebaseContext);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const signUpUserWithEmailAndPassword = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUserWithEmailAndPass = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogleAccount = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const handleCreateNewListing = async (name, isbn, price, coverPic) => {
    const imageRef = ref(
      storage,
      `uploads/images/${Date.now()}-${coverPic.name}`
    );
    const uploadResult = await uploadBytes(imageRef, coverPic);
    return await addDoc(collection(fireStore, "books"), {
      name,
      isbn,
      price,
      imageURL: uploadResult.ref.fullPath,
      userId: user.uid,
      userEmail: user.email,
      userName: user.email.split("@")[0],
      userPhotoURL: user.photoURL,
    });
  };

  const getAllBooks = () => {
    return getDocs(collection(fireStore, "books"));
  }

  const getImageDownloadURL = (path) => {
    return getDownloadURL(ref(storage, path));
  }

  const getBookById = async (id) => {
    return await getDoc(doc(fireStore, "books", id));
  }

  const getOrdersByBookId = async (bookId) => {
    const ordersSnapshot = await getDocs(collection(fireStore, `books/${bookId}/orders`));
    const orders = ordersSnapshot.docs.map(doc => doc.data());
    return orders;
  }

  const updateBookById = async (id, updatedData) => {
    const bookDoc = doc(fireStore, "books", id);
    return await updateDoc(bookDoc, updatedData);
  }

  const deleteBookById = async (id) => {
    const bookDoc = doc(fireStore, "books", id);
    return await deleteDoc(bookDoc);
  }

  const isLoggedIn = user ? true : false;

  return (
    <firebaseContext.Provider
      value={{
        signUpUserWithEmailAndPassword,
        signInUserWithEmailAndPass,
        loginWithGoogleAccount,
        isLoggedIn,
        signOutUser,
        user,
        handleCreateNewListing,
        getAllBooks,
        getImageDownloadURL,
        getBookById,
        getOrdersByBookId,
        updateBookById,
        deleteBookById
      }}
    >
      {props.children}
    </firebaseContext.Provider>
  );
};
