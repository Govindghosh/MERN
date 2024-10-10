import { ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import useLogin from "../hooks/useLogin";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function LoginPage() {
  const { login } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg.jpg')] bg-cover bg-no-repeat px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full md:max-w-lg lg:max-w-xl p-8 md:p-10 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              loading ? "cursor-not-allowed opacity-50" : "hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div>
            <Link
              to="/signUp"
              className="text-sm text-blue-900 hover:text-gray-900"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default LoginPage;
