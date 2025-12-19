import json
import re
import time
from datetime import date, timedelta
from typing import Dict, Any, List, Optional

import requests
from bs4 import BeautifulSoup

BASE = "https://www.drikpanchang.com/panchang/month-panchang.html"

# Choose location:
# - If you want New Delhi default, you can omit geoname-id.
# - For a specific city, pass geoname-id (e.g. Mumbai is 1275339 in the example URL).  :contentReference[oaicite:2]{index=2}
GEONAME_ID = None  # e.g. "1275339" for Mumbai
TIME_FORMAT = "24hour"  # "12hour" | "24hour" | "24plushour"  :contentReference[oaicite:3]{index=3}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; PanchangCrawler/1.0; +https://example.com)"
}

SESSION = requests.Session()
SESSION.headers.update(HEADERS)

# ------------ helpers ------------

def ddmmyyyy(d: date) -> str:
    return d.strftime("%d/%m/%Y")

def month_name(d: date) -> str:
    return d.strftime("%B")

def dow(d: date) -> str:
    return d.strftime("%A")

def build_url(d: date) -> str:
    params = {"date": ddmmyyyy(d), "time-format": TIME_FORMAT}
    if GEONAME_ID:
        params["geoname-id"] = GEONAME_ID
    # manual query build (avoid bringing urllib for simplicity)
    q = "&".join([f"{k}={requests.utils.quote(v)}" for k, v in params.items()])
    return f"{BASE}?{q}"

def clean_text(s: str) -> str:
    s = re.sub(r"\s+", " ", s).strip()
    return s

def pick_first(patterns: List[str], text: str) -> Optional[str]:
    for pat in patterns:
        m = re.search(pat, text, flags=re.IGNORECASE)
        if m:
            return clean_text(m.group(1))
    return None

# ------------ parsing logic ------------

def parse_day_page(html: str, d: date) -> Dict[str, Any]:
    """
    DrikPanchang pages are fairly consistent text-wise (Sunrise/Sunset/Tithi/Star/Yoga etc show up).
    We parse from the full visible text as a robust fallback, because exact CSS classes can change.
    """
    soup = BeautifulSoup(html, "lxml")

    # Remove scripts/styles
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    text = clean_text(soup.get_text(" "))

    # timings (examples appear on pages like month-panchang for specific date) :contentReference[oaicite:4]{index=4}
    sunrise = pick_first([r"Sunrise\s*([0-9: ]+[AP]M)"], text)
    sunset  = pick_first([r"Sunset\s*([0-9: ]+[AP]M)"], text)
    moonrise = pick_first([r"Moonrise\s*([0-9: ]+[AP]M|No Moonrise)"], text)
    moonset  = pick_first([r"Moonset\s*([0-9: ]+[AP]M|No Moonset)"], text)

    # Panchang elements: often appear as labels near the Panchang section.
    # These regexes are best-effort; you can extend if you want more precise extraction.
    tithi = pick_first([r"\bTithi\b.*?\b([A-Za-z ]+)\b"], text)
    nakshatra = pick_first([r"\bNakshatra\b.*?\b([A-Za-z .]+)\b"], text)
    yoga = pick_first([r"\bYoga\b.*?\b([A-Za-z .]+)\b"], text)
    karana = pick_first([r"\bKarana\b.*?\b([A-Za-z .]+)\b"], text)

    # Festivals: DrikPanchang usually includes "Festival" labels in month view blocks (seen in snippets) :contentReference[oaicite:5]{index=5}
    # and also lists “festivals and vrats” in the page content.
    # Best-effort: collect likely festival strings by scanning common keywords.
    festival_keywords = [
        "Jayanti", "Ekadashi", "Amavasya", "Purnima", "Sankranti", "Navratri",
        "Chaturthi", "Ashtami", "Dussehra", "Diwali", "Holi", "Rakhi", "Raksha",
        "Shivaratri", "Janmashtami", "Rathyatra", "Chhath", "Teej", "Grahan",
        "Puja", "Vrat"
    ]

    # Heuristic: find short title-like phrases near “Festival” or matching keywords
    festivals = set()

    # 1) If the page contains a “Festival” label, grab nearby text chunks
    for m in re.finditer(r"\bFestival\b\s*([A-Za-z0-9*().,' -]{3,80})", text):
        cand = clean_text(m.group(1))
        # Avoid garbage
        if len(cand.split()) <= 8 and not any(x in cand.lower() for x in ["sunrise", "sunset", "panchang"]):
            festivals.add(cand)

    # 2) Add any keyword-matching title-case phrases (very heuristic)
    # This is intentionally conservative to reduce false positives.
    for kw in festival_keywords:
        for m in re.finditer(rf"\b([A-Z][A-Za-z*()'.-]+(?:\s+[A-Z][A-Za-z*()'.-]+){{0,4}}\s+{re.escape(kw)})\b", text):
            festivals.add(clean_text(m.group(1)))

    festivals = sorted(festivals)

    return {
        "date": d.isoformat(),
        "date_label": f"{d.strftime('%B %d, %Y')}, {dow(d)}",
        "weekday": dow(d),
        "timings": {
            "sunrise": sunrise,
            "sunset": sunset,
            "moonrise": moonrise,
            "moonset": moonset
        },
        "panchang": {
            "tithi": tithi,
            "nakshatra": nakshatra,
            "yoga": yoga,
            "karana": karana
        },
        "festivals": festivals
    }

def is_religious_observance(name: str) -> bool:
    key = name.lower()
    triggers = [
        "ekadashi", "amavas", "amavasya", "purnima", "sankranti", "grahan",
        "jayanti", "navratri", "chaturthi", "ashtami", "dwadashi", "trayodashi",
        "chaturdashi", "vrat", "puja"
    ]
    return any(t in key for t in triggers)

# ------------ crawl ------------

def crawl_years(start_year=2025, end_year=2026, sleep_s=1.0) -> Dict[str, Any]:
    start = date(start_year, 1, 1)
    end = date(end_year, 12, 31)

    daily: Dict[str, Any] = {}
    optionA: Dict[str, Dict[str, Dict[str, str]]] = {}  # Year->Month->Festival->DateLabel
    optionC: Dict[str, Dict[str, Dict[str, str]]] = {}  # Year->Month->Observance->DateLabel

    d = start
    while d <= end:
        url = build_url(d)
        r = SESSION.get(url, timeout=30)
        r.raise_for_status()

        day_data = parse_day_page(r.text, d)
        daily[day_data["date"]] = day_data

        y = str(d.year)
        m = month_name(d)

        optionA.setdefault(y, {}).setdefault(m, {})
        optionC.setdefault(y, {}).setdefault(m, {})

        # Option A (festival list only, de-duplicate by name within month)
        for f in day_data["festivals"]:
            optionA[y][m].setdefault(f, day_data["date_label"])

        # Option C (religious observances only)
        for f in day_data["festivals"]:
            if is_religious_observance(f):
                optionC[y][m].setdefault(f, day_data["date_label"])

        time.sleep(sleep_s)
        d += timedelta(days=1)

    # Option D: everything in one structure
    out = {
        "source": {
            "site": "drikpanchang.com",
            "base_url": BASE,
            "params": {
                "geoname_id": GEONAME_ID,
                "time_format": TIME_FORMAT
            }
        },
        "optionA_festivals_by_month": optionA,
        "optionB_daily_panchang": daily,
        "optionC_observances_by_month": optionC,
        "optionD_everything": {
            "years": sorted(list({str(start_year), str(end_year)})),
            "daily": daily,
            "by_month_festivals": optionA,
            "by_month_observances": optionC
        }
    }
    return out

if __name__ == "__main__":
    data = crawl_years(2025, 2026, sleep_s=1.0)
    with open("drikpanchang_2025_2026.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Saved: drikpanchang_2025_2026.json")
