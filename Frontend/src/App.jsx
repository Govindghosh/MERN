import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    axios
      .get("/api/friends")
      .then((response) => {
        setFriends(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <>
      <h3>connected backend and frontend</h3>
      <p>FRIENDS: {friends.length}</p>
      {friends.map((friend, index) => (
        <div key={friend.id}>
          <h4>Name-{friend.name}</h4>
          <h4>Age-{friend.age}</h4>
        </div>
      ))}
    </>
  );
}

export default App;
