import React, { useEffect, useState } from "react";
import "./quiz.css";
import Questions from "../../assets/questions.json";
import Result from "./result";
import { useNavigate, useParams } from "react-router-dom";

const ShowAnswers = ({ setSubmit }) => {
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(() => {
    // Checking/Getting saved Answers from LocalStorage
    const savedAnswers = localStorage.getItem("quizAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : [];
  });
  const params = useParams();
  const naviagate = useNavigate();

  return (
    <React.Fragment>
      <div id="quiz-Container">
        <div id="resposive-button">
          <div id="quiz-change-buttons">
            <button onClick={() => setShowResult(true)}>Show Result</button>
          </div>
        </div>

        {/* Questions Cards */} 
        <div id="quiz-Question">
          {Questions.filter(
            (e) =>
              e.topic.toLocaleLowerCase() === params.topic.toLocaleLowerCase()
          ).map((curr, index) => {
            let found = answered?.find((find) => find.question_ID === curr.id);
            return (
              <React.Fragment key={index}>
                <h4>Question {index + 1}</h4>
                <h2>{curr.question}</h2>
                <div id="options">
                  {curr.options.map((option, index) => {
                    let selectOption = "";
                    if (found?.selectedAnswer === option) {
                      option === curr.answer
                        ? (selectOption = "right")
                        : (selectOption = "wrong");
                    } else {
                      if (option === curr.answer) {
                        selectOption = "right";
                      }
                    }
                    return (
                      <p
                        key={index}
                        id="selectedOption"
                        className={selectOption}
                      >
                        {option}
                      </p>
                    );
                  })}
                </div>
                <div id="explanation">
                  <h3>Explanation</h3>
                  <p>{curr.explanation}</p>
                </div>
              </React.Fragment>
            );
          })}

          <div id="quiz-change-buttons">
            <button onClick={() => naviagate(`/result/${params.topic}`)}>
              Show Result
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ShowAnswers;
