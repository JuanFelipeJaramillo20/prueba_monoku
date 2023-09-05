import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';

const TrendsChart = ({ moodData }) => {
  // Extract dates and moods from the mood data
  const dates = moodData.map((entry) => entry.date);
  const moods = moodData.map((entry) => entry.mood);

  // Define data for the chart
  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Mood Trends',
        data: moods,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        tension: 0.1, // Line tension (smoothing)
      },
    ],
  };

  // Define chart options
  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day', // Display labels by day
        },
      },
      y: {
        beginAtZero: true,
        // You can customize the y-axis options here
      },
    },
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header as="h5">Gráfico de Tendencias de Estado de Ánimo</Card.Header>
            <Card.Body>
              <Line data={data} options={options} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TrendsChart;
