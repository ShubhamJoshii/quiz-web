import React, { useEffect, useState } from "react";
import "../quiz.css";
import Questions from "../../../assets/questions.json";
import QuizCard from "./quizCard";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    // Checking/Getting question state for providing last state of where user is visted from LocalStorage
    const temp = localStorage.getItem("currentQuestionStage");
    return temp ? parseInt(JSON.parse(temp)) : 0;
  });
  const [questions, setQuestions] = useState([]);

  const [visited, setVisited] = useState(() => {
    // Checking/Getting visited questions list from LocalStorage
    const temp = localStorage.getItem("visitedQuestions");
    return temp ? JSON.parse(temp) : [];
  });
  const [answered, setAnswered] = useState(() => {
    // Checking/Getting saved Answers from LocalStorage
    const savedAnswers = localStorage.getItem("quizAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : [];
  });
  // full screen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const initialTime = 10 * 60;
  const [timeLeft, setTimeLeft] = useState(() => {
    // Checking/Getting time state from LocalStorage

    const savedTime = localStorage.getItem("timeLeft");
    return savedTime ? JSON.parse(savedTime) : initialTime;
  });

  const [status, setStatus] = useState("quiz");

  const navigate = useNavigate();
  const params = useParams();

  const handleQuestion = (
    nextQuestion = parseInt(localStorage.getItem("currentQuestionStage")) || 0
  ) => {
    // updation localStorage when new question comes like when user click on Next, previous, and specfic question buttons
    setCurrentQuestion(nextQuestion);
    localStorage.setItem("currentQuestionStage", nextQuestion);
    let temp = JSON.parse(localStorage.getItem("resultStatus"));
    if (temp === null) {
      const id = questions[nextQuestion].id;
      let visitedTemp = [...new Set([...visited, id])];
      localStorage.setItem("visitedQuestions", JSON.stringify(visitedTemp));
      setVisited(visitedTemp);
    }
  };

  useEffect(() => {
    fetchQuestion();
    if (!isFullscreen) requestFullscreen();
  }, []);

  useEffect(() => {
    if (questions.length > 0) handleQuestion();
  }, [questions]);

  const fetchQuestion = () => {
    // fetching question based on quiz topic
    const temp = Questions.filter(
      (curr) =>
        curr.topic.toLocaleLowerCase() === params.topic.toLocaleLowerCase()
    );
    setQuestions(temp);
  };

  useEffect(() => {
    const savedAnswers = localStorage.getItem("quizAnswers");
    setAnswered(savedAnswers ? JSON.parse(savedAnswers) : []);
    const savedTime = localStorage.getItem("timeLeft");
    if (savedTime) {
      setTimeLeft(JSON.parse(savedTime));
    }

    if (status === "timeup") {
      localStorage.setItem("resultStatus", true);
      navigate(`/result/timeout/${params.topic}`);
    }
  }, [status]);

  const selectedAnswer = (question_ID, selectedAnswer) => {
    // seledt answers
    let found = answered.find((item) => item.question_ID === question_ID);
    // let answeredTemp = answered;
    if (found) {
      const answeredTemp = answered.map((curr, index) => {
        if (curr.question_ID === question_ID) {
          return {
            question_ID,
            selectedAnswer,
          };
        } else {
          return curr;
        }
      });
      setAnswered(answeredTemp);
    } else {
      const answeredTemp = [
        ...answered,
        {
          question_ID,
          selectedAnswer,
        },
      ];
      setAnswered(answeredTemp);
    }
  };

  useEffect(() => {
    // for checking quiz timeout
    if (isFullscreen) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            const newTime = prevTime - 1;
            localStorage.setItem("timeLeft", newTime);
            return newTime;
          } else {
            clearInterval(timer);
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isFullscreen]);

  useEffect(() => {
    // for checking quiz timeout
    if (timeLeft === 0) {
      setStatus("timeup");
    }
  }, [timeLeft]);

  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  // time remananing
  const minutes = formatNumber(Math.floor(timeLeft / 60));
  const seconds = formatNumber(timeLeft % 60);

  // handling full screen
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  // handling full screen
  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    localStorage.setItem("topic", JSON.stringify(params.topic));
    const resultStatus = JSON.parse(localStorage.getItem("resultStatus"));
    if (resultStatus !== null && resultStatus) {
      navigate("/");
    }
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const requestFullscreen = () => {
    document.documentElement.requestFullscreen();
  };

  const submitQuiz = () => {
    // for submit quiz on condition like quiz submit only when all question is attempted
    console.log(answered)
    if (answered?.length > 9) {
      localStorage.setItem("resultStatus", true);
      navigate(`/result/${params.topic}`);
    } else {
      toast.info("All the questions are compulsory", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <React.Fragment>
      {questions.length > 0 && (
        <React.Fragment>
          {/* Show when not having full screen */}
          {!isFullscreen && (
            <div id="full-Screen">
              <div id="full-Screen-Card">
                <p>
                  Please click the button below to enter full-screen mode and
                  start the quiz.
                </p>
                <button onClick={requestFullscreen}>
                  Enter Full-Screen Mode
                </button>
              </div>
            </div>
          )}
          <div id="quiz-Container">
            <div id="resposive-button">
              <div id="quiz-change-buttons">
                <button
                  onClick={() => handleQuestion(currentQuestion - 1)}
                  disabled={currentQuestion === 0 ? true : false}
                >
                  Previous
                </button>
                <button
                  onClick={() => handleQuestion(currentQuestion + 1)}
                  disabled={currentQuestion === 9 ? true : false}
                >
                  Next
                </button>
              </div>
              <button
                id="submit-quiz"
                disabled={answered.length === 0 ? true : false}
                onClick={submitQuiz}
              >
                SUBMIT
              </button>
            </div>
            <p id="time-countdown">
              {minutes}:{seconds}
            </p>
            <div id="quiz-Question">
              <h1 id="resposive-topic">{params.topic.toLocaleUpperCase()}</h1>

              <QuizCard
                question={questions[currentQuestion]}
                answered={answered}
                selectedAnswer={selectedAnswer}
              />

              <div id="quiz-change-buttons">
                <button
                  onClick={() => handleQuestion(currentQuestion - 1)}
                  disabled={currentQuestion <= 1 ? true : false}
                >
                  Previous
                </button>
                <button
                  onClick={() => handleQuestion(currentQuestion + 1)}
                  disabled={currentQuestion === 9 ? true : false}
                >
                  Next
                </button>
              </div>
            </div>
            <div id="quiz-All-Questions">
              <h1 id="resposive-topic">{params.topic.toLocaleUpperCase()}</h1>
              <div id="first-half">
                <h4>Question {parseInt(currentQuestion) + 1}/10</h4>
                {/* Quiz Question Number for showcase (Visited, unvisted, answer choosen or not ) or jumping to specific question  */}
                <div id="question-Numbers">
                  {questions.map((curr, index) => {
                    let visitedClass = "";
                    const found = visited.find((item) => item === curr.id);
                    if (found) {
                      visitedClass = "visited";
                    }
                    answered.find((e) => {
                      if (e.question_ID === curr.id) {
                        visitedClass = "visited-answered";
                      }
                    });
                    return (
                      <div
                        key={index}
                        className={visitedClass}
                        onClick={() => handleQuestion(index)}
                      >
                        {index + 1}
                      </div>
                    );
                  })}
                </div>
                <p style={{ color: "red", fontSize: "12px" }}>
                  * All the questions are compulsory
                </p>
              </div>

              <button
                id="submit-quiz"
                // disabled={answered.length === 0 ? true : false}
                style={
                  answered.length < 10
                    ? { backgroundColor: "#bebcbc7c", color: "black" }
                    : {}
                }
                onClick={submitQuiz}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Quiz;
