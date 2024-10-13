import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import useSignUp from "../hooks/user/useSignUp";

function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { loading, signUp } = useSignUp();

  const onSubmit = async (formData) => {
    const result = await signUp(formData);
    if (result) reset();
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[url('/bg.jpg')] bg-cover bg-no-repeat px-4 sm:px-6 lg:px-8">
        <div className="bg-transparent shadow-lg rounded-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="space-y-4"
          >
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register("fullName", { required: "Full name is required" })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Avatar</label>
              <input
                type="file"
                accept="image/*"
                {...register("avatar", { required: "Avatar is required" })}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {errors.avatar && (
                <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>
              )}
            </div>

            {/* Cover Image Upload (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                {...register("coverImage")}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-indigo-700"}`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <div>
              <Link to="/" className="text-sm text-blue-900 hover:text-gray-900">
                You have an account? Log In
              </Link>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
