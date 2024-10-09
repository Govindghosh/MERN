
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";

function App() {
  
  return (
    <>
      
        <Routes>
          <Route
            path="/"
            element={ <LoginPage />}
          />
        </Routes>
    </>
  );
}

export default App;
