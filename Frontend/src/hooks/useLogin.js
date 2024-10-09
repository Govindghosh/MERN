import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import toastConfig from "../components/toast"; 
import { login as authLogin } from "../store/authSlice";

const useLogin = () => {
  const dispatch = useDispatch();

  const login = async (data) => {
    try {
      const response = await axios.post(import.meta.env.VITE_LOGIN_API, data);
      console.log(response.data);
      dispatch(authLogin(response.data));
      toast.success(response.data.message, toastConfig);
      return response.data;
    } catch (error) {
      toast.error("user does not exist", toastConfig);
    }
  };
  return { login };
};

export default useLogin;
