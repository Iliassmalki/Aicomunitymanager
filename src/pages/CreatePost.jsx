import React, { useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import "./CreatePost.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const api = axios.create({
  baseURL: "http://localhost:3000/", // your backend URL
});

const tones = [
  { value: "professional", label: "Professionnel" },
  { value: "fun", label: "Fun" },
  { value: "motivational", label: "Motivant" },
];

const lengths = [
  { value: "short", label: "Court" },
  { value: "medium", label: "Moyen" },
  { value: "long", label: "Long" },
];

export default function CreatePost() {
  const [form, setForm] = useState({
    prompt: "",
    tone: "professional",
    length: "medium",
    includeImage: false,
    hashtagsCount: 0,
    language: "fr",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date())
  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const generate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/api/generate", form);
      setResult(data);
    } catch (err) {
      const msg = err?.response?.data?.error || "Erreur lors de la génération";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  const handlePostNow = async () => {
    try {
      const payload = {
        title: result.text.slice(0, 50) || "AI-generated Post",
        content: result.text,
        hashtags: (result.hashtags || []).join(" "),
        imageUrl: result.image_url || null,
        start: scheduledDate,
        end: new Date(scheduledDate.getTime() + 60 * 60 * 1000),
      };
  
      const response = await axios.post(
        "http://localhost:3000/api/posts/linkedin/postnow",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      
      console.log("✅ Posted to LinkedIn:", response.data);
      alert("Post published successfully!");
    } catch (error) {
      console.error("❌ Error posting:", error.response?.data || error.message);
      alert("Failed to publish post.");
    }
  };
  const schedulePost = async (scheduledDate) => {
    if (!result) {
      alert("Aucun post à planifier !");
      return;
    }
  
    const payload = {
      title: result.text.slice(0, 50) || "AI-generated Post",
      content: result.text,
      hashtags: (result.hashtags || []).join(" "),
      imageUrl: result.image_url || null,
      start: scheduledDate,
      end:  new Date(scheduledDate.getTime() + 60 * 60 * 1000), 

    };
  
    try {
      const response = await api.post("/api/addpost", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      
   
      console.log("Post planifié:", response.data);
      alert("Post planifié avec succès !");
    } catch (err) {
      console.error("Erreur lors de la planification:", err.response?.data || err.message);
      alert("Erreur lors de la planification du post.");
    }
  };
  

  const copy = async (txt) => {
    try {
      await navigator.clipboard.writeText(txt);
      alert("Copié !");
    } catch {
      alert("Impossible de copier");
    }
  };

  const copyAll = () => {
    const all = `${result?.text || ""}\n\n${(result?.hashtags || []).join(" ")}`;
    copy(all);
  };

  const previewChars = useMemo(() => (result?.text || "").length, [result]);

  const suggestions = [
    "Utilisez un ton engageant et posez une question pour encourager les commentaires.",
    "Ajoutez 3 à 5 hashtags pertinents pour augmenter la visibilité.",
    "Incluez une anecdote personnelle pour capter l'attention.",
    "Structurez votre post avec des phrases courtes et un appel à l'action clair.",
    "Postez entre 9h et 11h pour maximiser l'engagement.",
  ];

  return (
    
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Génération de contenu (aperçu uniquement)</h2>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={generate}>
            <div>
              <label className="text-sm font-medium">Sujet / Prompt</label>
              <textarea
                className="mt-1 w-full border rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Décris le thème du post…"
                value={form.prompt}
                onChange={(e) => onChange("prompt", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Ton</label>
                <select
                  className="mt-1 w-full border rounded-lg p-3"
                  value={form.tone}
                  onChange={(e) => onChange("tone", e.target.value)}
                >
                  {tones.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Longueur</label>
                <select
                  className="mt-1 w-full border rounded-lg p-3"
                  value={form.length}
                  onChange={(e) => onChange("length", e.target.value)}
                >
                  {lengths.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium"># Hashtags</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  className="mt-1 w-full border rounded-lg p-3"
                  value={form.hashtagsCount}
                  onChange={(e) => onChange("hashtagsCount", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="includeImage"
                type="checkbox"
                checked={form.includeImage}
                onChange={(e) => onChange("includeImage", e.target.checked)}
                className="h-5 w-5"
              />
              <label htmlFor="includeImage" className="text-sm font-medium">
                Inclure une image (IA)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Génération en cours..." : "Générer"}
            </button>
          </form>
        </div>

        {/* Preview */}
        
        {showCalendar && (
  <div className="calendar-popup">
    <h3>Choisissez la date et l'heure :</h3>
    <DatePicker
      selected={scheduledDate}
      onChange={(date) => setScheduledDate(date)}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      dateFormat="yyyy-MM-dd HH:mm"
      minDate={new Date()}
    />
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => {
          schedulePost(scheduledDate);
          setShowCalendar(false);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Confirmer
      </button>
      <button
        onClick={() => setShowCalendar(false)}
        className="bg-gray-300 px-4 py-2 rounded"
      >
        Annuler
      </button>
    </div>
  </div>
)}

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Aperçu</h2>
            {result?.text && (
              <span className="text-xs text-gray-500">{previewChars} caractères</span>
            )}
          </div>

          {!result ? (
            <p className="text-gray-500">Le contenu généré apparaîtra ici…</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => copy(result.text)} className="px-3 py-1 text-sm rounded-lg border hover:bg-gray-50">
                  Copier le texte
                </button>
                {result.hashtags?.length > 0 && (
                  <button onClick={() => copy(result.hashtags.join(" "))} className="px-3 py-1 text-sm rounded-lg border hover:bg-gray-50">
                    Copier les hashtags
                  </button>
                )}
                <button onClick={copyAll} className="px-3 py-1 text-sm rounded-lg border hover:bg-gray-50">
                  Copier tout
                </button>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button   onClick={handlePostNow} className="postbutton">
                  Publier maintenant
                </button>

                <button onClick={() => setShowCalendar(true)} className="schedulebutton">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Planifier ce post
                </button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Texte</h3>
                <div className="whitespace-pre-wrap text-gray-800">{result.text}</div>
              </div>

              {result.hashtags?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((h, i) => (
                      <span key={i} className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">{h}</span>
                    ))}
                  </div>
                </div>
              )}

              {result.image_url && (
                <div>
                  <h3 className="font-semibold mb-2">Image (aperçu)</h3>
                  <img src={result.image_url} alt="Aperçu IA" className="rounded-lg border w-full max-h-[320px] object-cover"/>
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          <div className="mt-6 p-4 rounded-lg bg-linkedin-light-blue suggestions-window">
            <h3 className="font-semibold mb-2 text-linkedin-blue">Suggestions pour vos posts</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-linkedin-blue">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
