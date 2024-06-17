import React, { useEffect, useState } from "react";
import "./App.css";
import Quiz from "./components/quiz/question/quiz";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartQuiz from "./components/quiz/StartQuiz";
import ShowAnswers from "./components/quiz/showAnswer";
import Result from "./components/quiz/result";
import TimesUp from "./components/quiz/timesup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <React.Fragment>
    {/* Toast Notification */}
      <ToastContainer />
      <Router>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<StartQuiz />} />
          <Route path="/startquiz" element={<StartQuiz />} />
          <Route path="/quiz/:topic" element={<Quiz />} />
          <Route path="/quizanswer/:topic" element={<ShowAnswers />} />
          <Route path="/result/:topic" element={<Result />} />
          <Route path="/result/timeout/:topic" element={<TimesUp />} />
          <Route path="*" element={<StartQuiz />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
