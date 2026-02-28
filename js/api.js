// ===== API Keys =====
// מפתח גישה ל-OpenWeather API
const OPENWEATHER_KEY = "80b5b3f967ca85ceab65464cc8806f42";

// ===== Base URLs =====
// כתובות בסיס לקריאות API שונות
const OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";
const WIKI_SUMMARY_URL = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

// ===== Helpers =====
// פונקציית עזר כללית לביצוע בקשת fetch והחזרת JSON
async function fetchJson(url, options = {}, errorMessage = "Request failed") {
    const res = await fetch(url, options);

    // בדיקה אם הבקשה הצליחה
    if (!res.ok) {
        throw new Error(`${errorMessage} (status: ${res.status})`);
    }

    // המרה ל-JSON
    return await res.json();
}

// ===== Weather =====
// קבלת נתוני מזג אוויר לפי שם עיר
async function getWeather(city) {
    const url =
        `${OPENWEATHER_URL}?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=metric`;

    // קריאה ל-API והחזרת הנתונים
    return await fetchJson(url, {}, "Weather API error");
}

// ===== Wikipedia: Top 3 Attractions =====
// קבלת 3 אטרקציות מובילות מהוויקיפדיה
async function getAttractionsTop3(city) {

    // חיפוש אטרקציות בעיר
    const searchUrl =
        `${WIKI_API_URL}?origin=*&action=query&list=search&format=json&srlimit=3&srsearch=${encodeURIComponent(city + " attractions")}`;

    const searchData = await fetchJson(searchUrl, {}, "Attractions search failed");
    const results = searchData?.query?.search || [];

    // בדיקה אם לא נמצאו תוצאות
    if (results.length === 0) {
        throw new Error("No attractions found");
    }

    // עבור כל תוצאה – בקשת סיכום מפורט
    const items = await Promise.all(
        results.map(async (r) => {
            const title = r.title;

            try {
                const sumData = await fetchJson(
                    `${WIKI_SUMMARY_URL}${encodeURIComponent(title)}`,
                    {},
                    "Attractions summary failed"
                );

                return {
                    title: sumData.title || title,
                    extract: sumData.extract || "No summary available.",
                    link: sumData?.content_urls?.desktop?.page || null
                };
            } catch {
                // במקרה של שגיאה בסיכום
                return { title, extract: "No summary available.", link: null };
            }
        })
    );

    return items;
}

// ===== Wikipedia: Top 3 Hotels =====
// קבלת 3 מלונות מובילים מהוויקיפדיה
async function getHotelsTop3(city) {

    // חיפוש מלונות בעיר
    const searchUrl =
        `${WIKI_API_URL}?origin=*&action=query&list=search&format=json&srlimit=3&srsearch=${encodeURIComponent(city + " hotels")}`;

    const searchData = await fetchJson(searchUrl, {}, "Hotels search failed");
    const results = searchData?.query?.search || [];

    if (results.length === 0) {
        throw new Error("No hotels found");
    }

    // שליפת סיכום עבור כל מלון
    const items = await Promise.all(
        results.map(async (r) => {
            const title = r.title;

            try {
                const sumData = await fetchJson(
                    `${WIKI_SUMMARY_URL}${encodeURIComponent(title)}`,
                    {},
                    "Hotels summary failed"
                );

                return {
                    title: sumData.title || title,
                    extract: sumData.extract || "No summary available.",
                    link: sumData?.content_urls?.desktop?.page || null
                };
            } catch {
                return { title, extract: "No summary available.", link: null };
            }
        })
    );

    return items;
}

// ===== Map (Geocoding) =====
// המרת שם עיר לקואורדינטות (קו רוחב וקו אורך)
async function geocodeCity(city) {

    const url =
        `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(city)}&limit=1`;

    const data = await fetchJson(
        url,
        { headers: { Accept: "application/json" } },
        "Geocoding failed"
    );

    // אם לא נמצאה עיר
    if (!data.length) {
        throw new Error("City not found");
    }

    // החזרת קואורדינטות ושם תצוגה
    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name
    };
}