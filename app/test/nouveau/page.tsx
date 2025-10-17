"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Question = {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: string;
  level: string;
};

export default function NouveauTest() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domain = useMemo(
    () => searchParams.get("domain") || "",
    [searchParams]
  );
  const [redirecting, setRedirecting] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [prenom, setPrenom] = useState("");
  const [identifiant, setIdentifiant] = useState("");
  const [dashboard, setDashboard] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [candidateName, setCandidateName] = useState<string>("");
  const [existingCandidate, setExistingCandidate] = useState<
    null | { candidate: string }[]
  >(null);
  const [checking, setChecking] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const [resultSummary, setResultSummary] = useState<{
    score: number;
    total: number;
    percentage: number;
  } | null>(null);

  // Minuteur (15 secondes)
  const TEST_LIMIT_SECONDS = 15;
  const [elapsedSec, setElapsedSec] = useState(0);
  const [remainingSec, setRemainingSec] = useState(TEST_LIMIT_SECONDS);
  const timerRef = useRef<number | null>(null);

  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  async function finishTest(elapsed: number) {
    const total = questions.length;
    const score = questions.reduce(
      (acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0),
      0
    );
    const percentage = total > 0 ? (score / total) * 100 : 0;
    setResultSummary({ score, total, percentage });
    setFinished(true);

    try {
      setSavingResult(true);
      await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate: candidateName || prenom,
          category: domain || "",
          score,
          total,
          answers,
          duration: elapsed,
        }),
      });
    } catch {
      // ignore errors for UI
    } finally {
      setSavingResult(false);
    }
  }

  useEffect(() => {
    // Démarre le timer quand le test commence
    if (
      !showModal &&
      questions.length > 0 &&
      !finished &&
      timerRef.current == null
    ) {
      timerRef.current = window.setInterval(() => {
        setElapsedSec((prev) => {
          const next = prev + 1;
          setRemainingSec(Math.max(0, TEST_LIMIT_SECONDS - next));
          if (next >= TEST_LIMIT_SECONDS) {
            if (timerRef.current != null) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            // auto-terminer
            finishTest(next);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current != null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showModal, questions.length, finished]);

  const handleCancel = () => {
    // Redirige vers la page d’accueil pour éviter une page vide
    router.push("/");
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasExisting =
      Array.isArray(existingCandidate) && existingCandidate.length > 0;
    if (prenom.trim() && (identifiant.trim() || hasExisting)) {
      try {
        setLoading(true);
        setError("");
        setCandidateName(prenom);
        // Récupère des questions par catégorie (domain), sinon toutes
        const qs = new URLSearchParams();
        if (domain) qs.set("category", domain);
        qs.set("limit", "10");
        const res = await fetch(
          `/api/questions${qs.toString() ? `?${qs.toString()}` : ""}`
        );
        if (!res.ok) throw new Error("Erreur lors du chargement des questions");
        const data = await res.json();
        const parsed: Question[] = (data || []).map((q: any) => ({
          ...q,
          options: Array.isArray(q.options)
            ? q.options
            : (() => {
                try {
                  return JSON.parse(q.options || "[]");
                } catch {
                  return [] as string[];
                }
              })(),
        }));
        setQuestions(parsed);
        setCurrent(0);
        setShowModal(false);
        setLoading(false);
      } catch (err) {
        setError("Impossible de démarrer le test.");
        setLoading(false);
      }
    }
  };

  // Exemple de récupération et parsing des questions
  // (à placer dans la logique de démarrage du test réel)
  // const [questions, setQuestions] = useState([]);
  // useEffect(() => {
  //   fetch('/api/questions')
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Informations du candidat
            </h2>
            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre prénom"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identifiant
                </label>
                <input
                  type="text"
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Identifiant unique"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setChecking(true);
                      const qs = new URLSearchParams();
                      qs.set("candidate", prenom.trim());
                      const res = await fetch(`/api/results?${qs.toString()}`);
                      const data = await res.json();
                      setExistingCandidate(Array.isArray(data) ? data : []);
                    } catch {
                      setExistingCandidate([]);
                    } finally {
                      setChecking(false);
                    }
                  }}
                  className="px-4 py-2 bg-gray-100 rounded"
                  disabled={!prenom.trim() || checking}
                >
                  {checking ? "Vérification..." : "Vérifier l'existence"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Valider
                </button>
              </div>
              {existingCandidate && existingCandidate.length > 0 && (
                <div className="mt-4 p-3 border rounded bg-yellow-50 text-sm text-yellow-800">
                  Un candidat nommé <strong>{prenom}</strong> existe déjà.
                  Souhaitez-vous passer cette étape et démarrer le test
                  directement pour ce candidat ?
                  <div className="mt-3 flex gap-2">
                    <button
                      className="px-3 py-2 bg-yellow-100 rounded"
                      onClick={async (e) => {
                        e.preventDefault();
                        // passer l'étape: on garde le prénom tel quel et on démarre le test
                        await handleStart(e);
                      }}
                    >
                      Utiliser cet utilisateur
                    </button>
                    <button
                      className="px-3 py-2 bg-white border rounded"
                      onClick={(e) => {
                        e.preventDefault();
                        setExistingCandidate([]);
                      }}
                    >
                      Changer de nom
                    </button>
                  </div>
                </div>
              )}
            </form>
            {error && <div className="text-red-600 mt-4">{error}</div>}
            {confirmation && (
              <div className="text-green-600 mt-4">{confirmation}</div>
            )}
            {redirecting && (
              <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 animate-pulse">
                <span className="w-3 h-3 rounded-full bg-blue-300 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                <span className="ml-2">Redirection...</span>
              </div>
            )}
            {loading && (
              <div className="text-blue-600 mt-4">
                Chargement des questions...
              </div>
            )}
          </div>
        </div>
      )}

      {!showModal && questions.length > 0 && !finished && (
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Candidat: <span className="font-medium">{candidateName}</span>
            </div>
            <div className="text-xs text-gray-500">
              Catégorie: {domain || "—"}
            </div>
            <div className="ml-3 text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
              Temps restant: {formatSeconds(remainingSec)}
            </div>
          </div>
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-600 rounded transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(((current + 1) / questions.length) * 100)
                  )}%`,
                }}
              />
            </div>
            <div className="text-right mt-1 text-xs text-gray-500">
              {Math.min(
                100,
                Math.round(((current + 1) / questions.length) * 100)
              )}
              %
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Question {current + 1} / {questions.length}
          </h2>
          <div className="mb-4">
            <span className="font-medium text-gray-700">
              {questions[current]?.question}
            </span>
          </div>
          <div className="mb-6">
            {questions[current]?.options.map((opt: string, idx: number) => (
              <div key={idx} className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="answer"
                    value={opt}
                    className="mr-2"
                    checked={answers[questions[current].id] === opt}
                    onChange={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [questions[current].id]: opt,
                      }))
                    }
                  />
                  {opt}
                </label>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
              disabled={current === 0}
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            >
              Précédent
            </button>
            {current < questions.length - 1 ? (
              <button
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                onClick={() =>
                  setCurrent((c) => Math.min(questions.length - 1, c + 1))
                }
              >
                Suivant
              </button>
            ) : (
              <button
                className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-semibold"
                onClick={async () => {
                  if (timerRef.current != null) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                  }
                  await finishTest(elapsedSec);
                }}
              >
                Terminer
              </button>
            )}
            <button
              className="ml-auto px-6 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 font-semibold"
              onClick={() => {
                if (timerRef.current != null) {
                  clearInterval(timerRef.current);
                  timerRef.current = null;
                }
                router.push("/dashboard");
              }}
            >
              Arrêter et revenir au dashboard
            </button>
          </div>
        </div>
      )}

      {!showModal && finished && resultSummary && (
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mt-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Résultats</h2>
          <p className="text-gray-600 mb-4">
            {candidateName || prenom} — {domain || "Toutes catégories"}
          </p>
          <div className="text-4xl font-extrabold mb-2">
            {resultSummary.score} / {resultSummary.total}
          </div>
          <div className="text-lg text-gray-700 mb-6">
            {Math.round(resultSummary.percentage)}%
          </div>
          <button
            className={`px-6 py-2 rounded text-white ${
              savingResult ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={() => router.push("/dashboard")}
            disabled={savingResult}
          >
            {savingResult ? "Enregistrement..." : "Continuer vers le dashboard"}
          </button>
        </div>
      )}
    </section>
  );
}
