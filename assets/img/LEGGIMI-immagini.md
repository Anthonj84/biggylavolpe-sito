# Immagini del sito

Le quattro illustrazioni sono generate su Higgsfield (workspace personale, gpt_image_2, 16:9, senza testo: il testo lo mette il sito in Poppins, così non ci sono errori di accenti).

| File | Dove si usa |
|---|---|
| `hero-home.jpg` | Volpe in trench davanti alla parete di faldoni: sfondo dell'apertura della home |
| `og-default.jpg` | Ritratto della volpe: anteprima di condivisione per home, metodo, media kit, contatti |
| `og-sbarchi.jpg` | Mappa del Mediterraneo con le rotte: testata e anteprima dell'articolo sugli sbarchi |
| `og-salis.jpg` | Aula parlamentare col seggio rosso: testata e anteprima dell'articolo sul caso Salis |

Sono in JPEG a 1344×752, fra i 33 e i 64 KB: pesano venti volte meno dei PNG originali da 1,1 MB e a occhio sono identiche, perché sono illustrazioni scure e piatte.

Gli originali PNG in piena qualità restano su Higgsfield nello storico delle generazioni del 22 settembre 2026.

## Nota sulla resa

L'originale ha una luminosità media di 27 su 255, cioè è quasi nero. Il CSS la schiarisce (`filter: brightness`) e la isola sul lato destro con una maschera, altrimenti sotto il titolo spariva. Se un giorno si rigenerano le illustrazioni più chiare, quel filtro va ridotto: sta in `assets/css/site.css`, nelle regole `.hero--full::before` e `.article-hero::before`.
