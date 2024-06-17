import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Questions from "../../assets/questions.json";

const TimesUp = () => {
  const [answered, setAnswered] = useState(() => {
    // Checking/Getting saved Answers from LocalStorage
    const savedAnswers = localStorage.getItem("quizAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : [];
  });
  
  const [indicatorValues, setIndicatorValue] = useState(() => {
    // Checking/Getting Values from LocalStorage
    const temp = localStorage.getItem("indicatorValues");
    return temp
      ? JSON.parse(temp)
      : {
          value: 0,
          text: "",
        };
  });

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    // for calculation the scored marks and grades
    const resultStatus = JSON.parse(localStorage.getItem("resultStatus"));
    if (resultStatus !== null && resultStatus) {
      let correctAnswer = answered.map((curr) => {
        const temp = Questions.find(
          (question) => question.id === curr.question_ID
        );
        return temp.answer === curr.selectedAnswer;
      });
      correctAnswer = correctAnswer.reduce((acc, curr) => {
        if (curr) {
          return (acc += 10);
        }
        return acc;
      }, 0);
      
      // generating grade
      let text = "Awesome";
      if (correctAnswer >= 70 && correctAnswer < 90) {
        text = "Good";
      }
      if (correctAnswer >= 50 && correctAnswer < 70) {
        text = "Average";
      }
      if (correctAnswer < 50) {
        text = "Bad";
      }
      localStorage.setItem(
        "indicatorValues",
        JSON.stringify({ text, value: correctAnswer })
      );
      setIndicatorValue({ text, value: correctAnswer });
    } else {
      navigate("/");
    }
  }, []);

  const restart = () => {
    [
      "indicatorValues",
      "answered",
      "quizAnswers",
      "visitedQuestions",
      "visited",
      "currentQuestionStage",
      "timeLeft",
      "resultStatus",
      "topic",
    ].forEach((item) => localStorage.clear(item));
    navigate(`/quiz/${params.topic}`);
  };


  return (
    <React.Fragment>
      <div id="after-submit">
        <p id="TimeUP">Time Up!</p>
        <p id="indicator-Text">
          Your score is <span>{indicatorValues.text}</span>
        </p>
        <h1 id="score"><span>{indicatorValues.value}</span>/100</h1>
        <div id="buttons">
          <button onClick={() => navigate(`/quizanswer/${params.topic}`)}>
            Show Answer
          </button>
          <button onClick={restart}>Restart</button>
          <button onClick={()=>navigate("/")}>Home</button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TimesUp;
