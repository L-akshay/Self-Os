import React from 'react'
import Lottie from 'lottie-react';
import loginAnim from "../assets/lottie/login.json";
import { createUser } from '../Firebase/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';


function handleGoogleLogin() {
  console.log("Google login clicked");

}

function SignUp() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const create=async ()=>{
    try {
      const user=await createUser(email,password);
      console.log("Account Created Successfullyy:", user);
      // have to add redirect of page 

      
    } catch (error) {
         setError(error.message)

      
    }
  }


  return (
   

    <section className="h-screen w-full flex bg-[#0d1117] text-white p-20">
   
    
      <div className="w-1/2 flex justify-center items-center bg-[#0d1117]">
        <Lottie
          animationData={loginAnim}
          loop={true}
          className="h-[100%] w-auto max-h-[700px]"
        />
      </div>

      
      <div className="w-1/2 flex flex-col justify-center items-center px-6">
        <h1 className="text-4xl font-extrabold mb-6">SelfOs</h1>

        <div className="w-full bg-[#161b22] rounded-xl shadow-xl sm:max-w-md xl:p-0">
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
            <p className="text-sm text-gray-400 text-center">
              Log in to your Execution Engine
            </p>
            <div className="space-y-4">
  <div>
    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email</label>
    <input
      type="email"
      id="email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      className="bg-[#0d1117] border border-gray-600 text-white rounded-md block w-full p-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      placeholder="you@example.com"
    />
     
  </div>

  <div>
    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      className="bg-[#0d1117] border border-gray-600 text-white rounded-md block w-full p-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      placeholder="••••••••"    
    />
    <button
    onClick={create}
    className="w-full bg-green-600 hover:bg-green-700 px-5 py-3 rounded-md text-white"
  >
    Create Account
  </button>


  </div>
                    <p className="text-sm text-gray-400 text-center mt-4">
                         Already have an account?{" "}
                         <Link to="/" className="text-indigo-500 hover:underline">
                         Log in
                         </Link>
                      </p>
              </div>


            </div>
          </div>
        </div>
      
    </section>
  );
}

export default SignUp;
