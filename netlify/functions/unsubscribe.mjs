import crypto from "node:crypto";

const NETLIFY_API = "https://api.netlify.com/api/v1";
const SITE_ID = "cb3a5647-3e2e-45c1-8223-6454e26e88f3";
const FORM_ID = "6ab231ea82c1e900087c580b"; // form "newsletter"

function sign(email, secret) {
  return crypto.createHmac("sha256", secret).update(email.toLowerCase().trim()).digest("hex").slice(0, 32);
}

export default async (req) => {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const token = url.searchParams.get("token") || "";

  const pageStart = `<!doctype html><html lang="it"><meta charset="utf-8"><title>Cancella iscrizione</title>
    <body style="font-family:Georgia,serif;max-width:480px;margin:80px auto;text-align:center;color:#1a1a1a;">`;
  const pageEnd = `<p><a href="https://biggylavolpe.it/">Torna al sito</a></p></body></html>`;

  if (!email || !token || !process.env.NEWSLETTER_SECRET) {
    return new Response(`${pageStart}<h1>Link non valido.</h1>${pageEnd}`, {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const expected = sign(email, process.env.NEWSLETTER_SECRET);
  if (token !== expected) {
    return new Response(`${pageStart}<h1>Link non valido o scaduto.</h1>${pageEnd}`, {
      status: 403,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (!process.env.NETLIFY_API_TOKEN) {
    return new Response(`${pageStart}<h1>Errore di configurazione.</h1>${pageEnd}`, {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const subsRes = await fetch(`${NETLIFY_API}/sites/${SITE_ID}/forms/${FORM_ID}/submissions`, {
    headers: { Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}` },
  });
  if (subsRes.ok) {
    const submissions = await subsRes.json();
    const match = submissions.find(
      (s) => (s.data && s.data.email ? String(s.data.email) : "").trim().toLowerCase() === email
    );
    if (match) {
      await fetch(`${NETLIFY_API}/submissions/${match.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}` },
      });
    }
  }

  return new Response(
    `${pageStart}<h1>Fatto.</h1><p>${email} non ricevera' piu' le email di Biggy la Volpe.</p>${pageEnd}`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
};
