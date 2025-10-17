"use client";
import { useState } from "react";

export default function DashboardTable({ results }: { results: any[] }) {
  const [rows, setRows] = useState(results);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    candidate: "",
    category: "",
    score: "",
    total: "",
  });
  const [saving, setSaving] = useState(false);

  const handleDelete = async (id: number) => {
    setLoadingId(id);
    await fetch(`/api/results/${id}`, { method: "DELETE" });
    setRows(rows.filter((r) => r.id !== id));
    setLoadingId(null);
  };

  const openEdit = (r: any) => {
    setEditing(r);
    setForm({
      candidate: r.candidate ?? "",
      category: r.category ?? "",
      score: String(r.score ?? ""),
      total: String(r.total ?? ""),
    });
  };

  const closeEdit = () => {
    setEditing(null);
    setSaving(false);
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      setSaving(true);
      const payload: any = {
        candidate: form.candidate.trim(),
        category: form.category.trim(),
      };
      const scoreNum = Number(form.score);
      const totalNum = Number(form.total);
      if (!Number.isNaN(scoreNum)) payload.score = scoreNum;
      if (!Number.isNaN(totalNum)) payload.total = totalNum;

      const res = await fetch(`/api/results/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("PATCH failed");
      const updated = await res.json();
      setRows((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      closeEdit();
    } catch (e) {
      alert("Mise à jour impossible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <table className="w-full border rounded bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Candidat</th>
            <th className="p-2">Catégorie</th>
            <th className="p-2">Score</th>
            <th className="p-2">Pourcentage</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.candidate}</td>
              <td className="p-2">{r.category}</td>
              <td className="p-2">
                {r.score} / {r.total}
              </td>
              <td className="p-2">{r.percentage}%</td>
              <td className="p-2">
                {new Date(r.date ?? r.createdAt).toLocaleString()}
              </td>
              <td className="p-2 flex gap-2">
                <button
                  className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs"
                  onClick={() => openEdit(r)}
                >
                  Modifier
                </button>
                <button
                  className={`px-2 py-1 bg-red-100 text-red-800 rounded text-xs ${
                    loadingId === r.id ? "opacity-50" : ""
                  }`}
                  onClick={() => handleDelete(r.id)}
                  disabled={loadingId === r.id}
                >
                  {loadingId === r.id ? "Suppression..." : "Supprimer"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Modifier le candidat</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Candidat
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.candidate}
                  onChange={(e) =>
                    setForm({ ...form, candidate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Catégorie
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Score
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={form.score}
                    onChange={(e) =>
                      setForm({ ...form, score: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Total
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={form.total}
                    onChange={(e) =>
                      setForm({ ...form, total: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
                onClick={closeEdit}
                disabled={saving}
              >
                Annuler
              </button>
              <button
                className={`px-3 py-2 text-sm rounded text-white ${
                  saving ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={saveEdit}
                disabled={saving}
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
