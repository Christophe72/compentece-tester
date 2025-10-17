"use client";
import DashboardTable from "../../components/DashboardTable";
import { useState } from "react";

export default function DashboardClient({
  results,
  questions,
}: {
  results?: any[];
  questions?: any[];
}) {
  // Valeurs par défaut pour éviter les erreurs TypeScript
  const safeResults = results ?? [];
  const [questionRows, setQuestionRows] = useState<any[]>(questions ?? []);
  const [editing, setEditing] = useState<any | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleDeleteQuestion(id: number) {
    await fetch(`/api/questions/${id}`, { method: "DELETE" });
    setQuestionRows((prev) => prev.filter((q) => q.id !== id));
  }

  function openEditModal(q: any) {
    setEditing(q);
    setEditValue(q.question || "");
  }

  async function saveEdit() {
    if (!editing) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/questions/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: editValue }),
      });
      if (!res.ok) throw new Error("PATCH failed");
      const updated = await res.json();
      setQuestionRows((prev) =>
        prev.map((x) => (x.id === updated.id ? updated : x))
      );
      closeModal();
    } catch (e) {
      alert("Mise à jour impossible");
    } finally {
      setSaving(false);
    }
  }

  function closeModal() {
    setEditing(null);
    setEditValue("");
  }
  return (
    <section className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Derniers résultats</h2>
        <DashboardTable results={safeResults} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Questions récentes</h2>
        <ul className="space-y-2">
          {questionRows.map((q: any) => (
            <li
              key={q.id}
              className="border rounded p-3 bg-gray-50 flex items-center justify-between"
            >
              <div>
                <span className="font-medium">{q.question}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({q.category}, {q.level})
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs"
                  onClick={() => openEditModal(q)}
                >
                  Modifier
                </button>
                <button
                  className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs"
                  onClick={() => handleDeleteQuestion(q.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Modifier la question</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intitulé
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
                onClick={closeModal}
                disabled={saving}
              >
                Annuler
              </button>
              <button
                className={`px-3 py-2 text-sm rounded text-white ${
                  saving ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={saveEdit}
                disabled={saving || !editValue.trim()}
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
