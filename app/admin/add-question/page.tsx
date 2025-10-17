"use client";
import { useState } from "react";

export default function AddQuestionPage() {
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [answer, setAnswer] = useState("");
  const [level, setLevel] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
      if (res.ok) {
        setSuccess(true);
        setCategory("");
        setQuestion("");
        setOptions(["", ""]);
        setAnswer("");
        setLevel("");
      } else {
        setError("Erreur lors de l'ajout de la question.");
      }
    } catch {
      setError("Erreur réseau ou serveur.");
    }
  };

  return (
    <section className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Ajouter une question</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block mb-1 font-medium">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Choisir...</option>
            <option value="electricite">Électricité</option>
            <option value="informatique">Informatique</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Question</label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Options de réponse</label>
          {options.map((opt, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={opt}
                onChange={(e) => handleOptionChange(e.target.value, idx)}
                className="flex-1 border rounded px-3 py-2"
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded"
          >
            + Ajouter une option
          </button>
        </div>
        <div>
          <label className="block mb-1 font-medium">Bonne réponse</label>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Niveau</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Choisir...</option>
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
          </select>
        </div>
        {error && <div className="text-red-600 font-medium">{error}</div>}
        {success && (
          <div className="text-green-600 font-medium">
            Question ajoutée avec succès !
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
        >
          Ajouter
        </button>
      </form>
    </section>
  );
}
