import React, { useState, useEffect } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { BsCheckCircleFill, BsXCircleFill, BsQuestionCircle } from 'react-icons/bs';

export default function QuizEngineRenderer({ lesson, onComplete, isCompleted }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [allPassed, setAllPassed] = useState(isCompleted);

  const quizzes = lesson.quizzes || [];

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
    setAllPassed(isCompleted);
  }, [lesson, isCompleted]);

  if (quizzes.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-light">
        <BsQuestionCircle size={50} className="text-muted mx-auto mb-3" />
        <h4 className="fw-bold mb-3">No questions found.</h4>
        <Button variant="primary" className="rounded-pill px-4" onClick={() => onComplete()}>
          Mark as Complete & Continue
        </Button>
      </Card>
    );
  }

  if (allPassed) {
    return (
      <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-white border border-success border-opacity-25">
        <div>
          <div className="mb-4 d-inline-flex p-4 rounded-circle text-success" style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>
            <BsCheckCircleFill size={50} />
          </div>
        </div>
        <h3 className="fw-bold mb-3 text-success">Quiz Passed!</h3>
        <p className="text-muted mb-4">You have successfully answered all questions in this quiz.</p>
        <Button variant="outline-success" size="lg" className="rounded-pill px-5 fw-bold" onClick={() => onComplete()}>
          Continue to Next Lesson
        </Button>
      </Card>
    );
  }

  const currentQuiz = quizzes[currentQuestionIndex];

  const handleSubmit = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === currentQuiz.correct_option_index;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizzes.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setAllPassed(true);
      onComplete(); // auto-complete when finishing quiz
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setShowResult(false);
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      <div className="bg-light px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
        <span className="fw-bold text-primary">Question {currentQuestionIndex + 1} of {quizzes.length}</span>
        <span className="small text-muted">{lesson.title}</span>
      </div>

      <Card.Body className="p-4 p-md-5">
        <h4 className="fw-bold mb-4 lh-base">{currentQuiz.question}</h4>

        <div className="d-flex flex-column gap-3 mb-5">
          {currentQuiz.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            let variantClass = "bg-white border text-dark";
            let customStyle = { cursor: showResult ? 'default' : 'pointer' };
            let icon = null;

            if (showResult) {
              if (isSelected && isCorrect) {
                variantClass = "border border-success text-success fw-bold";
                customStyle.backgroundColor = 'rgba(25, 135, 84, 0.1)';
                icon = <BsCheckCircleFill />;
              } else if (isSelected && !isCorrect) {
                variantClass = "border border-danger text-danger fw-bold";
                customStyle.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                icon = <BsXCircleFill />;
              }
            } else if (isSelected) {
              variantClass = "border border-primary text-primary fw-bold";
              // Assuming primary is roughly a blue/dark blue. 
              // To be safe with the theme, color-mix is extremely reliable in modern browsers:
              customStyle.backgroundColor = 'color-mix(in srgb, var(--color-primary, #0d6efd) 10%, transparent)';
            }

            return (
              <div
                key={idx}
                className={`p-3 rounded-3 d-flex justify-content-between align-items-center transition-all ${variantClass}`}
                style={customStyle}
                onClick={() => !showResult && setSelectedOption(idx)}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className={`rounded-circle border d-flex justify-content-center align-items-center flex-shrink-0 ${isSelected ? 'border-primary bg-primary text-white' : 'border-secondary text-muted'}`}
                    style={{ width: '30px', height: '30px', fontSize: '0.9rem' }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={isSelected ? 'text-light' : 'text-dark'}>{option}</span>
                </div>
                {icon}
              </div>
            );
          })}
        </div>

        {showResult && (
          <Alert variant={isCorrect ? 'success' : 'danger'} className="mb-4 border-0 rounded-3 d-flex align-items-start gap-3">
            {isCorrect ? <BsCheckCircleFill size={24} className="mt-1" /> : <BsXCircleFill size={24} className="mt-1" />}
            <div>
              <h5 className="fw-bold mb-1">{isCorrect ? 'Correct!' : 'Incorrect'}</h5>
              {currentQuiz.explanation && (
                <p className="mb-0 opacity-75 small mt-2">{currentQuiz.explanation}</p>
              )}
            </div>
          </Alert>
        )}

        <div className="d-flex justify-content-end border-top pt-4">
          {!showResult ? (
            <Button
              variant="primary"
              className="rounded-pill px-5 fw-bold"
              disabled={selectedOption === null}
              onClick={handleSubmit}
            >
              Check Answer
            </Button>
          ) : isCorrect ? (
            <Button
              variant="success"
              className="rounded-pill px-5 fw-bold"
              onClick={handleNext}
            >
              {currentQuestionIndex < quizzes.length - 1 ? 'Next Question' : 'Complete Quiz'}
            </Button>
          ) : (
            <Button
              variant="warning"
              className="rounded-pill px-5 fw-bold"
              onClick={handleRetry}
            >
              Retry Question
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
