// Bookingkalenderen henter ledige tider her. Funktionen spørger Apps Scriptet (automatisering/henvendelser.gs),
// så den hemmelige nøgle bliver på serveren, og siden kun kalder sit eget domæne.
// Miljøvariabler i Netlify (scope: Functions): APPS_SCRIPT_URL og APPS_SCRIPT_TOKEN.

export default async () => {
  const url = Netlify.env.get("APPS_SCRIPT_URL");
  const token = Netlify.env.get("APPS_SCRIPT_TOKEN");
  if (!url || !token) return Response.json({ status: "ikke-sat-op" }, { status: 503 });

  try {
    const svar = await fetch(`${url}?action=ledige-tider&token=${encodeURIComponent(token)}`, { redirect: "follow" });
    const data = await svar.json();
    if (data.status !== "ok") return Response.json({ status: "fejl" }, { status: 502 });
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (fejl) {
    console.error("Kunne ikke hente ledige tider fra Apps Script:", fejl);
    return Response.json({ status: "fejl" }, { status: 502 });
  }
};

export const config = {
  path: "/api/ledige-tider",
  method: "GET",
};
