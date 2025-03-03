// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our Application!</h1>
      <div className="space-x-4">
        <Link 
          to="/login" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
        >
          Login
        </Link>
        <Link 
          to="/register" 
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
