import React from "react";

type Props = {
  candidate: string;
  category: string;
  score: number;
  total: number;
  percentage: number;
  date: Date;
  duration?: number;
};

export default function ResultCard({
  candidate,
  category,
  score,
  total,
  percentage,
  date,
  duration,
}: Props) {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 60)
      return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreLabel = (percentage: number) => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Satisfaisant";
    return "À améliorer";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{candidate}</h3>
          <p className="text-sm text-gray-600 capitalize">Test de {category}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full border text-sm font-medium ${getScoreColor(
            percentage
          )}`}
        >
          {getScoreLabel(percentage)}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Score:</span>
          <span className="font-semibold">
            {score} / {total} ({percentage.toFixed(1)}%)
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              percentage >= 80
                ? "bg-green-500"
                : percentage >= 60
                ? "bg-orange-500"
                : "bg-red-500"
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>
            {date.toLocaleDateString("fr-FR")} à{" "}
            {date.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {duration && <span>Durée: {duration} min</span>}
        </div>
      </div>
    </div>
  );
}
