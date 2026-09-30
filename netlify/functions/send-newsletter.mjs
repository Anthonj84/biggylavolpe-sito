import crypto from "node:crypto";

const NETLIFY_API = "https://api.netlify.com/api/v1";
const SITE_ID = "cb3a5647-3e2e-45c1-8223-6454e26e88f3";
const FORM_ID = "6ab231ea82c1e900087c580b"; // form "newsletter"

function sign(email, secret) {
  return crypto.createHmac("sha256", secret).update(email.toLowerCase().trim()).digest("hex").slice(0, 32);
}

export default async (req) => {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if (!process.env.NEWSLETTER_SECRET || key !== process.env.NEWSLETTER_SECRET) {
    return new Response("Non autorizzato", { status: 401 });
  }

  const title = url.searchParams.get("title");
  const link = url.searchParams.get("link");
  const excerpt = url.searchParams.get("excerpt") || "";
  const only = (url.searchParams.get("only") || "").trim().toLowerCase();
  if (!title || !link) {
    return new Response("Parametri mancanti: title, link (excerpt opzionale)", { status: 400 });
  }

  if (!process.env.NETLIFY_API_TOKEN) {
    return new Response("Manca la variabile NETLIFY_API_TOKEN", { status: 500 });
  }
  if (!process.env.RESEND_API_KEY) {
    return new Response("Manca la variabile RESEND_API_KEY", { status: 500 });
  }

  const subsRes = await fetch(`${NETLIFY_API}/sites/${SITE_ID}/forms/${FORM_ID}/submissions`, {
    headers: { Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}` },
  });
  if (!subsRes.ok) {
    return new Response(`Errore Netlify API (${subsRes.status}) leggendo gli iscritti`, { status: 502 });
  }
  const submissions = await subsRes.json();
  const allEmails = [...new Set(
    submissions
      .map((s) => (s.data && s.data.email ? String(s.data.email) : "").trim().toLowerCase())
      .filter((e) => e && e.includes("@"))
  )];

  let emails = allEmails;
  if (only) {
    if (!allEmails.includes(only)) {
      return new Response(`L'indirizzo ${only} non risulta tra gli iscritti al form newsletter`, { status: 404 });
    }
    emails = [only];
  }

  const results = [];
  for (const email of emails) {
    const token = sign(email, process.env.NEWSLETTER_SECRET);
    const unsubUrl = `https://biggylavolpe.it/.netlify/functions/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
    const html = `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
        <p style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#8a1f1f;">Biggy la Volpe</p>
        <h1 style="font-size:22px;line-height:1.3;">${title}</h1>
        <p style="font-size:16px;line-height:1.5;">${excerpt}</p>
        <p><a href="${link}" style="display:inline-block;background:#8a1f1f;color:#fff;padding:10px 18px;text-decoration:none;border-radius:4px;">Leggi l'inchiesta &rarr;</a></p>
        <hr style="border:none;border-top:1px solid #ddd;margin:32px 0 12px;">
        <p style="font-size:12px;color:#888;">Ricevi questa email perche' ti sei iscritto alla newsletter di biggylavolpe.it.
          <a href="${unsubUrl}" style="color:#888;">Cancella l'iscrizione</a>.</p>
      </div>`;

    let sendRes;
    let bodyText = "";
    try {
      sendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Anthonj Di Piro (Biggy la Volpe) <redazione@biggylavolpe.it>",
          to: email,
          subject: title,
          html,
          headers: { "List-Unsubscribe": `<${unsubUrl}>` },
        }),
      });
      if (!sendRes.ok) {
        try { bodyText = await sendRes.text(); } catch (_) {}
      }
      results.push({ email, ok: sendRes.ok, status: sendRes.status, error: sendRes.ok ? undefined : bodyText });
    } catch (err) {
      results.push({ email, ok: false, error: String(err) });
    }
  }

  return new Response(JSON.stringify({ sent: results.length, results }, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
};
