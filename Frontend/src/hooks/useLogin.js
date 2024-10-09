import { login as authLogin } from "../store/authSlice";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { toast } from 'react-toastify';

const useLogin = () => {
  const dispatch = useDispatch();

  const login = async (data) => {
    try {
      const response = await axios.post(import.meta.env.VITE_LOGIN_API, data);
      console.log(response.data)
      dispatch(authLogin(response.data));
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
  };

  return { login };
};

export default useLogin;