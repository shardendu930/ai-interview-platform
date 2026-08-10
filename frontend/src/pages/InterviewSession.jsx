import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import api from "../services/api";

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [listeningIndex, setListeningIndex] = useState(null);

  const fetchInterview = async () => {
    try {
      const response = await api.get(`/interview/${id}`);

      setInterview(response.data.interview);

      setAnswers(
        response.data.interview.questions.map(
          (question) => question.answer || "",
        ),
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to load interview");
    }
  };

  useEffect(() => {
    fetchInterview();
  }, []);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];

    updatedAnswers[index] = value;

    setAnswers(updatedAnswers);
  };

  const handleVoiceInput = (index) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        "Speech recognition is not supported. Please use Google Chrome.",
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListeningIndex(index);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      handleAnswerChange(index, transcript);
    };

    recognition.onerror = (event) => {
      console.log("Speech recognition error:", event.error);

      toast.error("Could not recognize your voice.");

      setListeningIndex(null);
    };

    recognition.onend = () => {
      setListeningIndex(null);
    };
  };

  const handleSubmit = async () => {
    try {
      await api.post(`/interview/${id}/submit`, {
        answers,
      });

      toast.success("Interview submitted");

      navigate(`/result/${id}`);
    } catch (error) {
      console.log(error);
      toast.error("Submission failed");
    }
  };

  if (!interview) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-8">{interview.title}</h1>

        {interview.questions.map((question, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="font-bold mb-3">Question {index + 1}</h2>

            <p className="mb-4">{question.question}</p>

            <textarea
              rows="5"
              className="w-full border rounded p-3"
              placeholder="Write your answer or use the microphone..."
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />

            <button
              type="button"
              onClick={() => handleVoiceInput(index)}
              className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {listeningIndex === index ? "🎙️ Listening..." : "🎤 Speak Answer"}
            </button>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Submit Interview
        </button>
      </div>
    </>
  );
};

export default InterviewSession;
