"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Role, Mode, FormData, FormErrors } from "@/utils/types";
import {
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  MailIcon,
  LockIcon,
  MapPinIcon,
} from "@/utils/icons";

const initialFormData: FormData = {
  fullName: "",
  universityName: "",
  companyName: "",
  companyAddress: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialErrors: FormErrors = {};

interface InputFieldProps {
  id: keyof FormData;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  error,
  icon,
}) => (
  <div>
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200
                  border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 transition-all duration-300
                  ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:border-blue-500 focus:ring-blue-500"
                  }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </div>
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        error ? "max-h-5 mt-1" : "max-h-0"
      }`}
    >
      <p id={`${id}-error`} className="text-red-500 text-xs">
        {error || "\u00A0"}
      </p>
    </div>
  </div>
);

const AuthForm: React.FC = () => {
  const [role, setRole] = useState<Role>(Role.Student);
  const [mode, setMode] = useState<Mode>(Mode.Login);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors(initialErrors);
  }, []);

  const handleRoleChange = useCallback(
    (newRole: Role) => {
      setRole(newRole);
      resetForm();
    },
    [resetForm]
  );

  const handleModeToggle = useCallback(() => {
    setMode((prevMode) => (prevMode === Mode.Login ? Mode.Signup : Mode.Login));
    resetForm();
  }, [resetForm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (mode === Mode.Signup) {
      if (role === Role.Student) {
        if (!formData.fullName) newErrors.fullName = "Full Name is required";
        if (!formData.universityName)
          newErrors.universityName = "University Name is required";
      } else {
        if (!formData.companyName)
          newErrors.companyName = "Company Name is required";
        if (!formData.companyAddress)
          newErrors.companyAddress = "Company Address is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted:", { role, mode, ...formData });
      alert("Form submitted successfully! Check the console for data.");
      resetForm();
    }
  };

  const title = useMemo(() => {
    const roleText = role === Role.Student ? "Student" : "Company";
    const modeText = mode === Mode.Login ? "Login" : "Sign Up";
    return `${roleText} ${modeText}`;
  }, [role, mode]);

  const iconClass = "w-5 h-5";

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition-all duration-500">
        <div className="relative flex rounded-lg bg-gray-100 dark:bg-gray-900 p-1">
          <div
            className={`absolute top-1 bottom-1 w-1/2 bg-blue-600 rounded-md shadow-lg transform transition-transform duration-300 ease-in-out
          ${role === Role.Student ? "translate-x-0" : "translate-x-full"}`}
          />
          <button
            onClick={() => handleRoleChange(Role.Student)}
            className={`relative z-10 w-1/2 p-2 rounded-md text-sm font-medium transition-colors duration-300 ${
              role === Role.Student
                ? "text-white"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => handleRoleChange(Role.Company)}
            className={`relative z-10 w-1/2 p-2 rounded-md text-sm font-medium transition-colors duration-300 ${
              role === Role.Company
                ? "text-white"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Company
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          {title}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            icon={<MailIcon className={iconClass} />}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            icon={<LockIcon className={iconClass} />}
          />

          <div
            className={`grid transition-all duration-500 ease-in-out ${
              mode === Mode.Signup
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="space-y-4 pt-4">
                {role === Role.Student ? (
                  <>
                    <InputField
                      id="fullName"
                      label="Full Name"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      error={errors.fullName}
                      icon={<UserIcon className={iconClass} />}
                    />
                    <InputField
                      id="universityName"
                      label="University Name"
                      type="text"
                      value={formData.universityName}
                      onChange={handleInputChange}
                      error={errors.universityName}
                      icon={<AcademicCapIcon className={iconClass} />}
                    />
                  </>
                ) : (
                  <>
                    <InputField
                      id="companyName"
                      label="Company Name"
                      type="text"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      error={errors.companyName}
                      icon={<BuildingOfficeIcon className={iconClass} />}
                    />
                    <InputField
                      id="companyAddress"
                      label="Company Address"
                      type="text"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      error={errors.companyAddress}
                      icon={<MapPinIcon className={iconClass} />}
                    />
                  </>
                )}
                <InputField
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  icon={<LockIcon className={iconClass} />}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {mode === Mode.Login ? "Log In" : "Create Account"}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          {mode === Mode.Login
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            onClick={handleModeToggle}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 ml-1 focus:outline-none focus:underline"
          >
            {mode === Mode.Login ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </main>
  );
};

export default AuthForm;
