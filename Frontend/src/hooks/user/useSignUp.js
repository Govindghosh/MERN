import axios from "axios";
import { toast } from "react-toastify";
import toastConfig from "../../components/toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useSignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signUp = async (data) => {  
    setLoading(true);
    
    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar[0]);
    
    if (data.coverImage?.[0]) {
      formData.append("coverImage", data.coverImage[0]);
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_SIGNUP_API,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message, toastConfig);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", toastConfig);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signUp };
};

export default useSignUp;
