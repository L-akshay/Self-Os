import React from 'react'
import { createContext,useContext,useEffect,useState } from 'react'
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../Firebase/config"

const AuthContext=createContext();

export function useAuth(){
  return useContext(AuthContext)
  

}
export function AuthProvider({children}){
  const [user,setUser]=useState(null)
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      setUser(user)
      setLoading(false)

    })
  },[])
   return (
    <AuthContext.Provider value={{user}}>
      {!loading && children}
    </AuthContext.Provider>
   )
}
