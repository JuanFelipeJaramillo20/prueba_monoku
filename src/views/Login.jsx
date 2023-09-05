import { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { supabase } from "../SupaBaseClient";
import "../styles/Login.css"; // Importa un archivo de estilos personalizado para el componente de inicio de sesión
import { useNavigate } from "react-router-dom";
const Login = () => {
  // Estados para almacenar el nombre de usuario y la contraseña
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Función para manejar cambios en el campo de nombre de usuario
  const handleemailChange = (e) => {
    setemail(e.target.value);
  };

  // Función para manejar cambios en el campo de contraseña
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error);
    } else {
      navigate("/moodtracker")
      console.log(data);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center h-100 w-100 align-middle">
      <Card className="login-card">
        <Card.Header as="h5">Iniciar Sesión</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su correo electrónico"
                value={email}
                onChange={handleemailChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Iniciar Sesión
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
