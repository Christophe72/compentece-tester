"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Question = {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: string;
  level: string;
  createdAt: string;
};

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory]);

  const fetchQuestions = async () => {
    try {
      const url =
        selectedCategory === "all"
          ? "/api/questions"
          : `/api/questions?category=${selectedCategory}`;

      const response = await fetch(url);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setQuestions(questions.filter((q) => q.id !== id));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Administration</h1>
        <Link
          href="/admin/add-question"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ Ajouter une question
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrer par catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              <option value="electricite">Électricité</option>
              <option value="informatique">Informatique</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Total: {questions.length} question(s)
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucune question trouvée
          </h3>
          <p className="text-gray-500 mb-4">
            Commencez par ajouter des questions pour créer vos tests.
          </p>
          <Link
            href="/admin/add-question"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ajouter la première question
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      question.category === "electricite"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {question.category}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                    {question.level}
                  </span>
                </div>
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  🗑️ Supprimer
                </button>
              </div>

              <h3 className="font-medium text-gray-800 mb-2">
                {question.question}
              </h3>

              <div className="text-sm text-gray-600">
                <div className="mb-1">
                  <strong>Options:</strong>{" "}
                  {Array.isArray(question.options)
                    ? question.options.join(" | ")
                    : JSON.parse(question.options).join(" | ")}
                </div>
                <div>
                  <strong>Réponse:</strong> {question.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
