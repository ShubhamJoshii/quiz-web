import React, { useEffect } from "react";

const QuizCard = ({ question, answered, selectedAnswer }) => {
  useEffect(() => {
    // geting selected quizAnswer from localStorage 
    localStorage.setItem("quizAnswers", JSON.stringify(answered));
  }, [answered]);

  // Quiz Cards
  return (
    <React.Fragment>
      <h4>
        Question {question.id} {" "}
        <span style={{ color: "red", fontSize: "16px" }}>*</span>
      </h4>

      <h2>{question.question}</h2>

      {/* QUiz Ooptions */}
      <div id="options">
        {question.options.map((option, index) => {
          const selectOption =
            answered.find((item) => item.question_ID === question.id)
              ?.selectedAnswer === option;
          return (
            <p
              key={index}
              onClick={() => selectedAnswer(question.id, option)}
              id="option"
              className={selectOption ? "selected" : ""}
            >
              {option}
            </p>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default QuizCard;
