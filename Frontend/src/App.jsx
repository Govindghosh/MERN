
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage"
import HomePage from "./pages/HomePage";
function App() {
  
  return (
    <>
      
        <Routes>
          <Route
            path="/"
            element={ <LoginPage />}
          />
          <Route
            path="/signUp"
            element={ <SignUpPage />}
          />
          <Route
            path="/home"
            element={ <HomePage />}
          />
        </Routes>
    </>
  );
}

export default App;
