import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Component/Dashboard";
import FileUpload from "./fileupload";
import Login from "./login";
import Userhome from "./Component/Userhome";
import Home from './Home';
import SignUp from "./SignUp";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/FileUpload" element={<FileUpload />} />
        <Route path="/Userhome" element={<Userhome />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
