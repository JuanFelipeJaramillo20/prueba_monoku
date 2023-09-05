import { Navbar, Nav } from 'react-bootstrap';
import "../styles/Navbar.css";

const CustomNavbar = () => (
  <Navbar bg="dark" variant="dark" expand="lg" className='navbar'>
    <Navbar.Brand href="/moodtracker">Monoku Tech Assessment</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto w-100 justify-content-start"> {/* Use ml-auto to push text to the left */}
        <Nav.Link href="/moodtracker">Mood Tracker</Nav.Link>
        <Nav.Link href="/trends">View Your Trends</Nav.Link>
        {/* Add more Nav.Link components for additional options */}
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default CustomNavbar;
