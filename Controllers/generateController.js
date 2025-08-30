const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const GeneratedPost = require("../models/Post.model");

// helpers JSON
const safeParseJSON = s => { try { return JSON.parse(s); } catch { return null; } };
const extractJSON = t => {
  if (!t) return null;
  const cleaned = t.replace(/```json/gi, "```").replace(/```/g, "").trim();
  try { return JSON.parse(cleaned); } catch {}
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
};
const normalizeHashtags = (arr, max) => {
  let h = Array.isArray(arr) ? arr : [];
  h = h.map(x => String(x||"").trim()).filter(Boolean).map(x => x.startsWith("#")?x:`#${x.replace(/\s+/g,"")}`);
  h = [...new Set(h)];
  return h.slice(0, Math.max(0, max));
};

exports.generateContent = async (req, res) => {
  console.log("[GEN] Endpoint called at", new Date().toISOString());
  console.log("[GEN] Request body:", req.body);

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("[GEN] Missing OPENAI_API_KEY");
      return res.status(500).json({ error: "OPENAI_API_KEY manquante" });
    }

    // accepte theme OU prompt
    const theme = (req.body.theme ?? req.body.prompt ?? "").toString().trim();
    if (!theme) {
      console.warn("[GEN] Missing theme/prompt");
      return res.status(400).json({ error: 'Le champ "theme" (ou "prompt") est requis.' });
    }

    const tone = String(req.body.tone || "professional").trim();
    const language = String(req.body.language || "fr");
    const length = String(req.body.length || "medium");
    const hashtagsCount = Math.max(0, Math.min(Number(req.body.hashtagsCount) || 4, 20));
    const includeImage = !!req.body.includeImage;

    console.log("[GEN] Params:", { theme, tone, language, length, hashtagsCount, includeImage });

    const lengthHint = length==="short" ? "80–140 mots" : length==="long" ? "200–300 mots" : "120–200 mots";
    const toneLabel = tone==="professional" ? "professionnel" : tone==="fun" ? "drôle" : "motivant";

    // 1) Texte + hashtags (JSON strict)
    const system = `Tu es un rédacteur expert en posts pour réseaux sociaux,tu as une audience professionel et aussi une audience qui est just interessée sur votre domaine. Écris en "${language}".
- Ton: ${toneLabel}
- Longueur: ${lengthHint}
- Structure: accroche -> développement -> conclusion/CTA
- Pas d'explications.
- Retourne STRICTEMENT un JSON valide (sans texte autour).`;
    const user = `Sujet: "${theme}"
Format JSON:
{
  "text": "post prêt à publier (sans salutations inutiles)",
  "hashtags": ["#tag1","#tag2","..."] // jusqu'à ${hashtagsCount} hashtags (0 si ${hashtagsCount}=0)
}`;

    console.log("[GEN] Sending request to OpenAI...");
    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role:"system", content: system }, { role:"user", content: user }],
      temperature: tone.toLowerCase().includes("fun") ? 0.9 : tone.toLowerCase().includes("motiv") ? 0.8 : 0.7,
    });

    console.log("[GEN] Raw OpenAI response:", chat?.choices?.[0]?.message?.content);

    const raw = chat?.choices?.[0]?.message?.content || "{}";
    const parsed = extractJSON(raw) || safeParseJSON(raw);
    console.log("[GEN] Parsed JSON:", parsed);

    const text = (parsed?.text || parsed?.post || `Post (fallback):\n${theme}`).toString().trim();
    const hashtags = normalizeHashtags(parsed?.hashtags, hashtagsCount);

    console.log("[GEN] Final text:", text.slice(0, 80) + "...");
    console.log("[GEN] Hashtags:", hashtags);

    let image_url = null;
if (includeImage) {
  try {
    console.log("[IMG] Generating image prompt...");

    // Use GPT-4 to generate a better descriptive image prompt
  
    
    
    const imagetheme="minimalistic";
    console.log("[IMG] Generated prompt:");

    // Generate the image using the detailed prompt
    const img = await openai.images.generate({
      model: "dall-e-3", // specify DALL·E 3
      prompt: `Illustration moderne et professionnelle sur le thème de ce texte, ${theme}. L'image doit être attirante et professionnelle pour un post LinkedIn elle doit aussi etre expressive avec un theme artistique ${imagetheme} qui est le plus adequat sur linkedin`,
      n: 1,
      size: "1792x1024",
    });
    

    image_url = img?.data?.[0]?.url || null;
    console.log("[IMG] Image URL:", image_url);


  } catch (e) {
    console.warn("[IMG] generation failed (continue):", e?.response?.data || e?.message || e);
    image_url = null;
  }
}
//POST OR SAVE

  

    // 4) Réponse
    console.log("[GEN] Success. Returning response...");
    return res.json({ id: null, text, hashtags, image_url });
  } catch (err) {
    console.error("[GEN] fatal:", err?.response?.data || err);
    const msg = err?.response?.data?.error?.message || err.message || "Generation failed";
    return res.status(500).json({ error: msg })
   
  }



  
};

exports.saveContent= async (req ,res) => {


    try {
      const post = await GeneratedPost.create({
        ...req.body,
        user: req.user._id, // Associate post with authenticated user
      });
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


