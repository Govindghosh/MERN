import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import toastConfig from "../../utils/toast";
const useGetUserChannel = (username) => {
  const [channelProfile, setChannelProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchChannelProfile = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_GETUSERCHANNELPROFILE_API.replace(':username', username)}`
        );
        toast.success(response.data.message, toastConfig);
        setChannelProfile(response.data.data); // Assuming `data` holds the channel profile.
      } catch (err) {
        toast.error(err.response ? err.response.data.message : 'An error occurred', toastConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelProfile();
  }, [username]);

  return { channelProfile, loading };
};

export default useGetUserChannel;
