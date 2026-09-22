# Sito Biggy la Volpe

Sito statico, nessun build step, nessuna dipendenza da installare. Sono file HTML, un CSS e un JS: si aprono con doppio clic e si caricano su qualsiasi hosting.

## Struttura

```
index.html                              home del canale
inchieste/index.html                    indice degli articoli
inchieste/sbarchi-i-numeri-veri.html    articolo (bozza da rivedere)
inchieste/caso-salis.html               articolo (bozza da rivedere)
inchieste/_modello-articolo.html        MODELLO per i prossimi pezzi (non pubblicato)
metodo.html                             il metodo e le regole di verifica
media-kit.html                          numeri, formati, cosa non facciamo
contatti.html                           contatti e rettifiche
404.html
assets/css/site.css                     tutto lo stile
assets/js/site.js                       solo menu mobile e anno nel footer
assets/img/favicon.svg
robots.txt · sitemap.xml · feed.xml · netlify.toml
```

## Come pubblicarlo (Netlify, il modo più veloce)

1. Vai su [app.netlify.com](https://app.netlify.com) e fai login.
2. "Add new site" → "Deploy manually": trascina la **cartella** `sito-biggy` nel riquadro.
3. Il sito è online su un indirizzo tipo `random-name.netlify.app`.
4. Per il dominio: "Domain management" → "Add a domain" → inserisci `biggylavolpe.it`. Netlify ti dà i nameserver o i record DNS da mettere nel pannello del registrar dove hai comprato il dominio. HTTPS si attiva da solo.

Per aggiornare il sito: ritrascini la cartella. Se preferisci non trascinare ogni volta, metti la cartella su GitHub e collega il repo a Netlify: da lì ogni modifica va online da sola.

### Alternative

- **Vercel**: `vercel deploy` dalla cartella, oppure import del repo GitHub dalla dashboard.
- **GitHub Pages**: crea un repo, carica i file, Settings → Pages → Source: branch `main`, cartella `/`. Attenzione: funziona bene solo con dominio personalizzato o con un repo chiamato `tuonome.github.io`, perché i link interni partono da `/`. Se usi un repo con sottocartella (`tuonome.github.io/sito`) devi cambiare tutti i link togliendo la `/` iniziale.

## Prima di andare online: tre cose da cambiare

1. **Il dominio.** Nei file compare `https://biggylavolpe.it` nei tag `canonical`, `og:url`, nella sitemap e nel feed. Se il dominio è diverso, sostituiscilo (una sostituzione cerca-e-sostituisci su tutti i file).
2. **Il link di X.** In fondo a ogni pagina c'è `https://x.com/biggylavolpe`: metti l'handle vero del profilo.
3. **Le immagini di condivisione.** I tag `og:image` puntano a `/assets/img/og-default.png`, `og-sbarchi.png`, `og-salis.png`, che **non esistono ancora**. Finché non ci sono, le anteprime su WhatsApp e Facebook usciranno senza immagine. Bastano tre PNG da 1200×630 px: si possono esportare dalle cover dei caroselli corrispondenti, ritagliate in orizzontale.

## Numeri da tenere aggiornati

In `index.html` e `media-kit.html` ci sono i contatori (follower, visualizzazioni, visualizzazioni al giorno). Sono i valori che mi hai dato, quindi vanno rinfrescati quando cambiano: cerca `stat__num` nei due file.

## Come si scrive un nuovo articolo

1. Copia `inchieste/_modello-articolo.html` in `inchieste/nome-slug.html`.
2. Sostituisci tutto quello che nel modello è scritto `[TRA PARENTESI QUADRE]`: titolo, sommario, date, sezione, corpo, fonti.
3. Aggiungi la voce in tre posti: `inchieste/index.html` (elenco), `index.html` (le tre card in home), `sitemap.xml` e `feed.xml`.
4. I blocchi pronti sono documentati nei commenti dentro il modello: tabella dati, nota tecnica grigia, riquadro rosso, citazione, elenco fonti.

Regola della casa che il modello impone da sola: l'elenco **Fonti** in fondo non è opzionale, e la lettura editoriale sta solo nella sezione "Il punto".

## Note tecniche

- Nessun cookie, nessun tracker, nessuna analitica. Se in futuro serve, meglio una soluzione senza cookie (Plausible, Umami) che non obbliga al banner.
- I font arrivano da Google Fonts. Per essere davvero cookie-free e più veloci si possono scaricare in locale: in quel caso si tolgono i due `preconnect` e il `link` a `fonts.googleapis.com` da ogni pagina e si sostituisce con un `@font-face` nel CSS.
- Tema chiaro e scuro automatici: il sito segue l'impostazione del sistema (`light-dark()` nel CSS).
- Transizioni fra pagine attive dove il browser le supporta (`@view-transition`), disattivate per chi ha ridotto le animazioni.
- Accessibilità: skip link, gerarchia dei titoli, contrasto verificato, menu mobile che funziona da tastiera.
