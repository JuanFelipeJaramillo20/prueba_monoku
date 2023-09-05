import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { supabase } from '../SupaBaseClient';
import { useNavigate } from 'react-router-dom';
import "../styles/Register.css";
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        let { data, error } = await supabase.auth.signUp({
            email,
            password
          })

      if (error) {
        throw error;
      }

      // Registro exitoso
      console.log(data);
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate("/login")
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      alert('Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center v-100 w-100">
      <Card className="registration-card">
        <Card.Header as="h5">Registro</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={handleEmailChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Registrarse
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
