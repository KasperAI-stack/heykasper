// Bookingkalenderen sender bookingen hertil. Funktionen tjekker input og honeypot og sender den videre
// til Apps Scriptet (automatisering/henvendelser.gs), som opretter mødet med Google Meet.
// Miljøvariabler i Netlify (scope: Functions): APPS_SCRIPT_URL og APPS_SCRIPT_TOKEN.

const HTTP_STATUS = { ok: 200, optaget: 409, ugyldig: 400 };

export default async (req) => {
  const url = Netlify.env.get("APPS_SCRIPT_URL");
  const token = Netlify.env.get("APPS_SCRIPT_TOKEN");
  if (!url || !token) return Response.json({ status: "ikke-sat-op" }, { status: 503 });

  let input;
  try {
    input = await req.json();
  } catch {
    return Response.json({ status: "ugyldig" }, { status: 400 });
  }

  // Honeypot: et skjult felt, som kun robotter udfylder. De får et "ok" uden at noget bliver booket.
  if (input.website) return Response.json({ status: "ok", start: input.start, meet: "" });

  const felt = (v, max) => String(v ?? "").trim().slice(0, max);
  const booking = {
    action: "book",
    start: felt(input.start, 40),
    navn: felt(input.navn, 200),
    virksomhed: felt(input.virksomhed, 200),
    email: felt(input.email, 200),
    emne: felt(input.emne, 2000),
  };
  if (!booking.navn || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email) || Number.isNaN(Date.parse(booking.start))) {
    return Response.json({ status: "ugyldig" }, { status: 400 });
  }

  try {
    const svar = await fetch(`${url}?token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
      redirect: "follow",
    });
    const data = await svar.json();
    return Response.json(data, { status: HTTP_STATUS[data.status] ?? 502 });
  } catch (fejl) {
    console.error("Kunne ikke booke via Apps Script:", fejl);
    return Response.json({ status: "fejl" }, { status: 502 });
  }
};

export const config = {
  path: "/api/book",
  method: "POST",
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
