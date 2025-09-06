import { useEffect, useState } from "react";
import { auth } from "../../Firebase/Firebase";
const AuthContext=React.createContext();


export function AuthProvider({children}){
  const [currentUser,setCurrentUser]=useState(null);
  const [userLoggedIn,setUserLoggedIn]=useState(false);
  const [loading,setLoading]=useState(true);


  useEffect(()=>{
    const unsubscribe
  })



}