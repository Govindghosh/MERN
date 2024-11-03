import  { useState } from 'react';
import useGetUserChannel from '../hooks/user/useGetUserChannel';

function ChannelProfileUI() {
  const [username, setUsername] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState(null);

  // Use the hook with the submitted username
  const { channelProfile, loading } = useGetUserChannel(submittedUsername);

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedUsername(username.trim());
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full px-4 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {channelProfile && (
        <div className="mt-6 text-left">
          <h2 className="text-2xl font-bold text-gray-800">{channelProfile.fullName}</h2>
          <p className="text-gray-600"><strong>Username:</strong> {channelProfile.username}</p>
          <p className="text-gray-600"><strong>Subscribers:</strong> {channelProfile.subscribersCount}</p>
          <p className="text-gray-600"><strong>Subscribed Channels:</strong> {channelProfile.channelsSubscribedToCount}</p>
          <p className="text-gray-600">
            <strong>Status:</strong> {channelProfile.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
          </p>
          <img
            src={channelProfile.avatar}
            alt={`${channelProfile.username}'s avatar`}
            className="w-24 h-24 mt-4 rounded-full object-cover border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}

export default ChannelProfileUI;
