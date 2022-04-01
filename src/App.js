import "./App.css";
import Routing from "./Routes";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <div className="bg-white h-screen ">
      <Routing />
      <ToastContainer />
    </div>
  );
};

export default App;
