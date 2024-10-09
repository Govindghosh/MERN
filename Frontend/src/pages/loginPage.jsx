
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function LoginPage() {
  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // State to store login response
  const [loginResponse, setLoginResponse] = useState(null);
  const [loginError, setLoginError] = useState(null);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Make API request using Axios
      const response = await axios.post(process.env.VITE_LOGIN_API, data);
      setLoginResponse(response.data);
      setLoginError(null);
    } catch (error) {
      setLoginError(error.response.data);
      setLoginResponse(null);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="block w-full p-2 mt-1 text-gray-700 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              className="block w-full p-2 mt-1 text-gray-700 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:ring-indigo-500"
          >
            Login
          </button>
          {loginResponse && (
            <p className="text-green-500 text-sm">{loginResponse.message}</p>
          )}
          {loginError && (
            <p className="text-red-500 text-sm">{loginError.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;