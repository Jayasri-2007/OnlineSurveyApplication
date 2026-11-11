
import { useState } from "react";
import axios from "axios";
import "./App.css";

const questionBank = [
  {
    question: "What is your favourite programming language?",
    options: ["C", "Java", "Python", "JavaScript"]
  },
  {
    question: "Which is your favourite subject?",
    options: ["Programming", "Mathematics", "Database", "Networking"]
  },
  {
    question: "How do you prefer learning?",
    options: ["Classroom", "Online", "Video Tutorials", "Self Learning"]
  },
  {
    question: "Which skill do you want to improve?",
    options: ["Communication", "Coding", "Teamwork", "Problem Solving"]
  },
  {
    question: "How do you rate our college?",
    options: ["Excellent", "Good", "Average", "Needs Improvement"]
  },
  {
    question: "What is your favourite hobby?",
    options: ["Reading", "Music", "Gardening", "Drawing"]
  },
  {
    question: "What is your career goal?",
    options: ["Software Developer", "Web Developer", "Data Analyst", "UI/UX Designer"]
  },
  {
    question: "Do you participate in college events?",
    options: ["Always", "Sometimes", "Rarely", "Never"]
  },
  {
    question: "Which technology do you want to learn?",
    options: ["React", "Node.js", "MongoDB", "Artificial Intelligence"]
  },
  {
    question: "How do you manage your time?",
    options: ["Timetable", "To-do List", "Reminders", "Without a Plan"]
  },
  {
    question: "Are you satisfied with the teaching methods?",
    options: ["Very Satisfied", "Satisfied", "Neutral", "Not Satisfied"]
  },
  {
    question: "Which activity do you enjoy most?",
    options: ["Coding", "Sports", "Cultural Events", "Workshops"]
  }
];

function getRandomQuestions() {
  return [...questionBank]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
}

function App() {
  const [questions, setQuestions] = useState(getRandomQuestions);
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (answers.some((answer) => !answer)) {
      setMessage("Please select an option for all 5 questions.");
      return;
    }

    const responses = questions.map((item, index) => ({
      question: item.question,
      answer: answers[index]
    }));

   try {
  const response = await axios.post(
    "https://online-survey-api.onrender.com/api/feedback",
    { responses }
  );

      setMessage(response.data.message);
      setQuestions(getRandomQuestions());
      setAnswers(["", "", "", "", ""]);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to submit survey. Please check the backend."
      );
    }
  };

  return (
    <div className="container">
      <h1>Online Survey Application</h1>
      <p>Select one option for each question.</p>

      <form onSubmit={handleSubmit}>
        {questions.map((item, index) => (
          <div className="question" key={item.question}>
            <p className="question-title">
              {index + 1}. {item.question}
            </p>

            {item.options.map((option) => (
              <label className="option" key={option}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={() => {
                    const updatedAnswers = [...answers];
                    updatedAnswers[index] = option;
                    setAnswers(updatedAnswers);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        ))}

        <button type="submit">Submit Survey</button>

        <button
          type="button"
          onClick={() => {
            setQuestions(getRandomQuestions());
            setAnswers(["", "", "", "", ""]);
            setMessage("");
          }}
        >
          Get New Questions
        </button>

        {message && <p role="status">{message}</p>}
      </form>

      <p>
        <a href="/responses.html">View Submitted Surveys</a>
      </p>
    </div>
  );
}

export default App;
