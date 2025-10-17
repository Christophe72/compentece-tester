"use client";
import React from "react";

type Props = {
  question: string;
  options: string[];
  selectedAnswer?: string;
  onSelect: (choice: string) => void;
  questionNumber: number;
  totalQuestions: number;
};

export default function QuestionCard({
  question,
  options,
  selectedAnswer,
  onSelect,
  questionNumber,
  totalQuestions,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {questionNumber} sur {totalQuestions}
          </span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-800 leading-relaxed">
          {question}
        </h3>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedAnswer === option
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
