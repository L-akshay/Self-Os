import { getAuth, signInWithEmailAndPassword,signOut,GoogleAuthProvider ,createUserWithEmailAndPassword,signInWithPopup } from "firebase/auth";
import { auth,provider } from "./config";
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error; 
  }
}
export async function createUser ( email, password) {
  try {
    const userCredential=await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
    
  } catch (error) {
    throw error;
    
  }
  
}
export async function GoogleSignin() {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    return result.user;
  } catch (error) {
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
}
