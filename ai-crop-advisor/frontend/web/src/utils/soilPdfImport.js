export function extractSoilMetricsFromText(rawText) {
  const original = String(rawText ?? "");
  const normalized = original
    .replace(/\u00a0/g, " ")
    .replace(/[\t\r]+/g, " ")
    .replace(/\n+/g, "\n")
    .replace(/[ \f\v]+/g, " ")
    .trim();

  const coerceNumberText = (value) => {
    if (value == null) return null;
    let text = String(value).trim();
    if (!text) return null;

    // Support comma decimal separators (e.g. "6,8").
    if (/^-?\d+,\d+$/.test(text)) text = text.replace(",", ".");

    const num = Number(text);
    return Number.isFinite(num) ? text : null;
  };

  const pick = (re) => {
    const m = normalized.match(re);
    if (!m) return null;
    return coerceNumberText(m[1]);
  };

  const pickText = (re) => {
    const m = normalized.match(re);
    if (!m) return null;
    const value = m[1];
    if (value == null) return null;
    const text = String(value)
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[,:;\-]+$/g, "")
      .trim();
    return text ? text : null;
  };

  // Try to be tolerant to common lab-report formatting.
  // Many reports put units/parentheses between label and value, e.g.:
  //   "Available Nitrogen (kg/ha) : 210"
  //   "pH (1:2.5) 6.8"
  const number = "(-?\\d+(?:[\\.,]\\d+)?)";
  const gapBeforeNumber = "[^0-9-]{0,40}";
  const unitTail = "(?:\\s*(?:kg\\/ha|kg\\s*ha-?1|ppm|mg\\/kg|%|meq\\/100g)\\b)?";

  const N =
    pick(new RegExp(`(?:available\\s*(?:nitrogen|n)\\b|nitrogen\\b)${gapBeforeNumber}${number}${unitTail}`, "i")) ??
    pick(new RegExp(`\\bN\\b\\s*[:=]\\s*${number}${unitTail}`, "i"));

  const P =
    pick(new RegExp(`(?:available\\s*(?:phosphorus|p)\\b|phosphorus\\b)${gapBeforeNumber}${number}${unitTail}`, "i")) ??
    pick(new RegExp(`\\bP\\b\\s*[:=]\\s*${number}${unitTail}`, "i"));

  const K =
    pick(new RegExp(`(?:available\\s*(?:potassium|k)\\b|potassium\\b)${gapBeforeNumber}${number}${unitTail}`, "i")) ??
    pick(new RegExp(`\\bK\\b\\s*[:=]\\s*${number}${unitTail}`, "i"));

  // pH is usually 0-14; match common labels.
  const ph =
    pick(new RegExp(`\\bp\\s*h\\b${gapBeforeNumber}${number}`, "i")) ??
    pick(new RegExp(`soil\\s*reaction\\b${gapBeforeNumber}${number}`, "i"));

  const temperature =
    pick(new RegExp(`(?:\\btemperature\\b|\\btemp\\b)${gapBeforeNumber}${number}(?:\\s*(?:°c|c|deg\\s*c)\\b)?`, "i")) ??
    pick(new RegExp(`(?:\\bmax\\s*temp(?:erature)?\\b|\\bmin\\s*temp(?:erature)?\\b)${gapBeforeNumber}${number}`, "i"));

  const humidity = pick(new RegExp(`(?:\\bhumidity\\b|\\brh\\b|relative\\s*humidity\\b)${gapBeforeNumber}${number}(?:\\s*%\\b)?`, "i"));

  const rainfall =
    pick(new RegExp(`(?:\\brainfall\\b|\\brain\\b|precip(?:itation)?\\b)${gapBeforeNumber}${number}(?:\\s*(?:mm|cm)\\b)?`, "i"));

  const pesticide = pick(new RegExp(`(?:\\bpesticide(?:s)?\\b|\\bpesticide\\s*use\\b)${gapBeforeNumber}${number}`, "i"));

  const last_crop =
    pickText(new RegExp(`(?:\\blast\\s*crop\\b|\\bprevious\\s*crop\\b|\\bpreceding\\s*crop\\b|\\bcrop\\s*grown\\s*last\\b)\\s*(?:is|=|:|-)?\\s*([^\n]{2,60})`, "i"));

  return { N, P, K, ph, temperature, humidity, rainfall, pesticide, last_crop };
}

export async function extractTextFromPdfFile(file, pdfjsLib) {
  if (!file) throw new Error("No file provided");
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let combined = "";
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const strings = (textContent.items || [])
      .map((it) => (typeof it?.str === "string" ? it.str : ""))
      .filter(Boolean);
    combined += `${strings.join(" ")}\n`;
  }

  return combined.trim();
}
