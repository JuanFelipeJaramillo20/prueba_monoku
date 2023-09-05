import { useState } from "react";
import { Container, Form, Button, Col, Row, Card } from "react-bootstrap";
import axios from "axios";
import { supabase } from "../SupaBaseClient";

const MoodTracker = () => {
  const [mood, setMood] = useState("Neutral");
  const [diaryEntry, setDiaryEntry] = useState("");
  const [sentimentEmoji, setSentimentEmoji] = useState("😐");
  const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;

  const handleMoodChange = (e) => {
    setMood(e.target.value);
  };

  const handleDiaryEntryChange = (e) => {
    setDiaryEntry(e.target.value);
  };

  const generatePrompt = (mood, diaryEntry) => {
    return `Me siento ${mood}. Hoy me sucedio esto: ${diaryEntry}. Crees que de verdad me siento ${mood}? Si crees que si me siento ${mood} responde '${mood}'. Si crees que me siento de otra manera responde con alguna de las opciones que mas identifique el sentimiento que identifiques: 'Neutral' o 'Triste'. Ten en cuenta que la respuesta debe ser solo una palabra, nada mas`;
  };

  const analyzeSentiment = async () => {
    let data = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: generatePrompt(mood, diaryEntry),
        },
      ],
      temperature: 0.7,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
        model: "gpt-3.5-turbo,",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data.choices[0].message.content);
        const analyzedMood = response.data.choices[0].message.content;
        if (analyzedMood !== mood) {
          setMood(analyzedMood);
          alert(
            "Nuestro asistente ha detectado otro humor:",
            analyzedMood,
            "Lo registraremos para tener un mejor seguimiento de como te sientes."
          );
        }
        saveInDB();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveInDB = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if(user){
        console.log("Usuario:", user);
        const result = await supabase.from("humor").insert({
          humor_seleccionado: mood,
          registro_diario: diaryEntry,
          userID: user.id
        });
        if(result.status === 201){
          alert("Tu humor ha sido guardado correctamente!")
        }
        console.log(result);
      }else{
        console.log("No user");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSentimentEmoji = (mood) => {
    const moodEmojis = {
      Feliz: "😄",
      Triste: "😢",
      Neutral: "😐",
    };

    return moodEmojis[mood] || "😐"; // Valor predeterminado si no coincide ningún estado de ánimo.
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-100 w-100 text-center">
      {" "}
      {/* Apply Bootstrap classes */}
      <Container fluid>
        {" "}
        {/* Apply Bootstrap classes */}
        <Row className="justify-content-center">
          {" "}
          {/* Apply the noGutters prop */}
          <Col lg={6}>
            <Card>
              <Card.Header as="h5">Registro de Estado de Ánimo</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Selección de Estado de Ánimo</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={handleMoodChange}
                      value={mood}
                    >
                      <option>Feliz</option>
                      <option>Triste</option>
                      <option>Neutral</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Entrada de Diario</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      onChange={handleDiaryEntryChange}
                      value={diaryEntry}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={analyzeSentiment}>
                    Analizar Sentimiento
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer>
                <p>Estado de Ánimo Actual: {mood}</p>
                <p>Sentimiento Analizado: {sentimentEmoji}</p>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MoodTracker;
