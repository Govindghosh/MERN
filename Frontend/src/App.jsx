
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signUpPage"
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
        </Routes>
    </>
  );
}

export default App;
