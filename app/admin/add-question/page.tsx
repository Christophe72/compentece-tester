"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddQuestionPage() {
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [answer, setAnswer] = useState("");
  const [level, setLevel] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleOptionChange = (value: string, idx: number) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (idx: number) =>
    setOptions(options.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (
      !category ||
      !question ||
      options.some((o) => !o) ||
      !answer ||
      !level
    ) {
      setError(
        "Tous les champs sont obligatoires et chaque option doit être remplie."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          question,
          options,
          answer,
          level,
        }),
      });

      setLoading(false);

      if (res.ok) {
        setSuccess(true);
        setCategory("");
        setQuestion("");
        setOptions(["", ""]);
        setAnswer("");
        setLevel("");
        setShowChoice(true);
      } else {
        setError("Erreur lors de l'ajout de la question.");
      }
    } catch {
      setLoading(false);
      setError("Erreur réseau ou serveur.");
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <section className="max-w-xl py-12 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Ajouter une question</h1>

      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 bg-white rounded shadow"
      >
        {/* Catégorie */}
        <div>
          <label className="block mb-1 font-medium">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Choisir...</option>
            <option value="electricite">Électricité</option>
            <option value="informatique">Informatique</option>
          </select>
        </div>

        {/* Question */}
        <div>
          <label className="block mb-1 font-medium">Question</label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Options */}
        <div>
          <label className="block mb-1 font-medium">Options de réponse</label>
          {options.map((opt, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={opt}
                onChange={(e) => handleOptionChange(e.target.value, idx)}
                className="flex-1 px-3 py-2 border rounded"
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="px-2 py-1 text-red-700 bg-red-100 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="px-3 py-1 mt-2 text-blue-700 bg-blue-100 rounded"
          >
            + Ajouter une option
          </button>
        </div>

        {/* Bonne réponse */}
        <div>
          <label className="block mb-1 font-medium">Bonne réponse</label>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Niveau */}
        <div>
          <label className="block mb-1 font-medium">Niveau</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Choisir...</option>
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
          </select>
        </div>

        {/* Messages d'état */}
        {error && <div className="font-medium text-red-600">{error}</div>}

        {loading && (
          <div className="flex items-center gap-2 font-medium text-blue-600">
            <svg
              className="w-5 h-5 text-blue-600 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Ajout en cours...
          </div>
        )}

        {success && showChoice && (
          <div className="space-y-4 font-medium text-green-600">
            <div>Question ajoutée avec succès !</div>
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={() => {
                  setSuccess(false);
                  setShowChoice(false);
                }}
              >
                Continuer à ajouter
              </button>
              <button
                type="button"
                className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                onClick={() => router.push("/dashboard")}
              >
                Aller au tableau de bord
              </button>
            </div>
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
        >
          Ajouter
        </button>
      </form>
    </section>
  );
}
