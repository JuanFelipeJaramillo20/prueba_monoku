import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import {
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
} from "date-fns";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { supabase } from "../SupaBaseClient";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import "../styles/Trends.css"; // Import the custom CSS for the dark theme

const Trends = () => {
  const [moodData, setMoodData] = useState([]);
  const [summary, setSummary] = useState("");
  const [monthlyMoodData, setMonthlyMoodData] = useState({
    labels: [],
    data: [],
  });
  const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };

  const getMoodData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const response = await supabase.from("humor").select();

      setMoodData(response.data);
    }
  };

  useEffect(() => {
    getMoodData();
  }, []);

  useEffect(() => {
    // Generate the monthly mood chart data
    const monthlyData = generateMonthlyMoodData(moodData);
    setMonthlyMoodData(monthlyData);
  }, [moodData]);

  // Function to calculate mood trends
  const calculateMoodTrends = (data) => {
    const sadEntries = data.filter(
      (entry) => entry.humor_seleccionado === "Triste"
    );
    const happyEntries = data.filter(
      (entry) => entry.humor_seleccionado === "Feliz"
    );
    const neutralEntries = data.filter(
      (entry) => entry.humor_seleccionado === "Neutral"
    );
    const summary = {
      sad: sadEntries.length,
      happy: happyEntries.length,
      neutral: neutralEntries.length,
    };

    return summary;
  };

  const generateMonthlyMoodData = (data) => {
    const currentDate = new Date();
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

    const moodCounts = {
      Feliz: Array(monthDays.length).fill(0),
      Neutral: Array(monthDays.length).fill(0),
      Triste: Array(monthDays.length).fill(0),
    };

    data.forEach((entry) => {
      const entryDate = new Date(entry.created_at);
      const dayIndex = monthDays.findIndex((day) => isSameDay(day, entryDate));

      if (dayIndex !== -1) {
        moodCounts[entry.humor_seleccionado][dayIndex]++;
      }
    });

    const labels = monthDays.map((day) => format(day, "dd/MM/yyyy"));

    const datasets = [
      {
        label: "Feliz",
        data: moodCounts.Feliz,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Neutral",
        data: moodCounts.Neutral,
        backgroundColor: "rgba(255, 205, 86, 0.5)",
      },
      {
        label: "Triste",
        data: moodCounts.Triste,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ];
    const summary = calculateMoodTrends(data);
    analyzeSummary(summary);
    return {
      labels,
      datasets,
    };
  };

  // Define a function to render mood labels on specific days
  const renderMoodLabels = ({ date, view }) => {
    if (view === "month") {
      const matchingMood = moodData.find((moodEntry) => {
        return isSameDay(date, new Date(moodEntry.date));
      });

      if (matchingMood) {
        return <div className="mood-label">{matchingMood.mood}</div>;
      }
    }
    return null;
  };

  const generatePrompt = (summary) => {
    return `Durante este mes me he sentido triste ${summary.sad} dias. Feliz durante ${summary.happy} dias y neutral durante ${summary.neutral} dias. ¿Crees que es un buen humor en general durante el mes?¿Puedes ofrecerme un análisis y consejos de mi situacion hasta ahora? Hazla no mayor a 5 lineas por favor.`;
  };

  const analyzeSummary = async (summary) => {
    let data = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: generatePrompt(summary),
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
        const analyzedSummary = response.data.choices[0].message.content;
        if (analyzedSummary) {
          setSummary(analyzedSummary);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container
      className="justify-content-center align-items-center h-100 w-100 text-center mt-5"
      fluid
    >
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card>
            <Card.Header as="h5">Tendencias de Estado de Ánimo</Card.Header>
            <Card.Body>
              <h6>Calendario de Estado de Ánimo</h6>
              <div className="wider-calendar">
                <ReactCalendar
                  tileContent={renderMoodLabels}
                  view="month"
                  tileClassName="dark-theme-tile"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header as="h5">
              Gráfico de Tendencias de Estado de Ánimo
            </Card.Header>
            <Card.Body>
              {monthlyMoodData && monthlyMoodData.datasets?.length > 0 ? (
                <Bar data={monthlyMoodData} options={options} />
              ) : (
                <p>Loading...</p> // You can display a loading indicator here
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Separate Row for the Summary */}
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card>
            <Card.Header as="h5">Resumen de Análisis</Card.Header>
            <Card.Body>
              <p>{summary || "No hay un resumen disponible"}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Trends;
