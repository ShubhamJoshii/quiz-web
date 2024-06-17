import React, { useEffect, useState } from "react";
import Img from "../../assets/quizImg.png";
import { useNavigate } from "react-router-dom";
import Questions from "../../assets/questions.json";
import { toast } from "react-toastify";

const StartQuiz = () => {
  const [showText, setShowText] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(() => {
    // getting value from localstorage if present
    const topic = localStorage.getItem("topic");
    return topic
      ? { current: JSON.parse(topic), prev: JSON.parse(topic) }
      : { current: "", prev: "" };
  });

  useEffect(() => {
    // generating a unique topic from Questions JSON -> Javascript, React, MERN
    const uniqueTopics = [
      ...new Set(Questions.map((question) => question.topic)),
    ];
    setTopics(uniqueTopics);
  }, []);

  const navigate = useNavigate();
  const handleStart = () => {
    if (selectedTopic.current === "") {
      // toast notification when user not selected a quiz topic
      toast.info("Select Quiz Topic Before starting!", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      // naviagting to quiz tab
      navigate(`/quiz/${selectedTopic.current}`);
    }
  };

  const handleTopicChange = (event) => {
    // setting a selected topic for quiz
    setSelectedTopic({ ...selectedTopic, current: event.target.value });
  };

  useEffect(() => {
    let quizAnswers = JSON.parse(localStorage.getItem("quizAnswers"));
    let temp = JSON.parse(localStorage.getItem("resultStatus"));
    if (temp !== null && Boolean(temp)) {
      // updating/clear localstorage states when user the previous quiz is completed
      localStorage.setItem("timeLeft", JSON.stringify(600));
      localStorage.setItem("resultStatus", JSON.stringify(false));
      localStorage.clear("quizAnswers");
      localStorage.clear("visitedQuestions");
      localStorage.clear("currentQuestionStage");
      localStorage.clear("indicatorValues");
      localStorage.clear("topic");
      setShowText(false);
      window.location.reload();
    } else if (quizAnswers !== null && quizAnswers?.length > 0 && !temp) {
      setShowText(true);
    } else if (
      selectedTopic.current === selectedTopic.prev &&
      selectedTopic.prev !== ""
    ) {
      setShowText(true);
    } else {
      setShowText(false);
    }
  }, []);

  return (
    <div className="startQuiz">
      <img src={Img} alt="QUIZ IMG" />
      <div>
        <div id="Instructions-Options">
          <h2>Instructions and Rules</h2>
          <select
            value={selectedTopic.current}
            onChange={handleTopicChange}
            disabled={selectedTopic.prev}
            defaultValue={selectedTopic}
          >
            <option value="">Select a topic</option>
            {topics.map((topic, index) => (
              <option key={index} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
        {/* Rules and Regulation for Quiz */}
        <ol>
          <li>Select a quiz from the dropdown menu above.</li>
          <li>
            Complete the quiz within <strong>10 minutes</strong>. The timer
            starts as soon as you begin.
          </li>
          <li>
            The quiz must be taken in full screen mode. Click{" "}
            <strong>"Start Quiz"</strong> and enter full screen mode to proceed.
          </li>
          <li>
            Navigate through the quiz by moving forward or backward between
            questions. You can also jump to a specific question.
          </li>
          <li>
            Read each question carefully, select the correct answer, and click{" "}
            <strong>"Next"</strong>.
          </li>
          <li>
            Your progress and remaining time are{" "}
            <strong>saved automatically</strong>. If you refresh the page, you
            will resume from the last question you were on.
          </li>
          <li>
            <strong>Note:</strong> Once you start the quiz, you will not be able
            to select a different quiz. Make sure you are ready to begin before
            clicking <strong>"Start Quiz"</strong>.
          </li>
        </ol>
      </div>
      <button
        id="submit-quiz"
        style={
          selectedTopic.current !== ""
            ? {}
            : { backgroundColor: "#bebcbc7c", color: "black" }
        }
        onClick={handleStart}
      >
        {showText ? "Resume Quiz" : "Start Quiz"}
      </button>
    </div>
  );
};

export default StartQuiz;
