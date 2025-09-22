"use client";
import React, { useState } from "react";

interface FormInputProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
}) => (
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full px-4 py-3 bg-[#2D2D2D] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-shadow"
  />
);

interface FormSelectProps {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

const FormSelect: React.FC<FormSelectProps> = ({
  id,
  value,
  onChange,
  children,
}) => (
  <div className="relative w-full">
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-[#2D2D2D] text-white rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-500 transition-shadow"
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
      <svg
        className="fill-current h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
);

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState("jyoti");
  const [password, setPassword] = useState("••••••••••");
  const [role, setRole] = useState("Faculty");

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans bg-gray-200 overflow-hidden p-4">
      <div className="absolute inset-0 -z-10 bg-[#D6D6D6]">
        <div
          className="absolute inset-y-0 left-0 w-3/4 bg-[#E0E0E0]"
          style={{ clipPath: "polygon(0 0, 100% 0, 75% 100%, 0% 100%)" }}
        ></div>
        <div
          className="absolute inset-y-0 right-0 w-3/4 bg-[#C0C0C0]"
          style={{ clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0% 100%)" }}
        ></div>
      </div>

      <main className="relative z-10 w-full max-w-4xl">
        <div className="flex flex-col lg:flex-row rounded-xl shadow-2xl overflow-hidden">
          <div className="w-full lg:w-5/12 bg-[#2D2D2D] flex flex-col justify-center items-center p-12 text-center min-h-[300px] lg:min-h-0">
            <h1
              className="text-white text-5xl font-serif leading-tight"
              style={{ textShadow: "1px 1px 3px rgba(255,255,255,0.2)" }}
            >
              Internship Management System
            </h1>
          </div>

          <div className="w-full lg:w-7/12 bg-[#F0F0F0] p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8 tracking-[0.2em]">
              SIGN IN
            </h2>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full max-w-sm mx-auto"
            >
              <div className="space-y-5">
                <FormInput
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <FormInput
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="text-right mt-4">
                <a href="#" className="text-sm text-gray-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <div className="flex items-center justify-center space-x-4 mt-8">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#BDBDBD] text-[#2D2D2D] font-semibold rounded-lg shadow-md hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-all transform hover:scale-105"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
export default AuthPage;
