import { RoutesConfiguration } from "./routes/routes";
import CustomNavbar from "./components/Navbar"; // Import the Navbar component
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
function App() {
  return (
    <>
      <CustomNavbar />
      <RoutesConfiguration></RoutesConfiguration>
    </>
  );
}

export default App;
