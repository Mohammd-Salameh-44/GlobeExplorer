
// קבלת אלמנטים מה-DOM
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const errorMsg = document.getElementById("errorMsg");

// בדיקה שהאלמנטים קיימים בדף
if (searchBtn && cityInput) {

    // פונקציה שמעבירה לדף התוצאות
    const goToResult = () => {
        const city = cityInput.value.trim(); // ניקוי רווחים

        // בדיקה אם המשתמש לא הזין עיר
        if (city === "") {
            errorMsg.textContent = "Please enter a city name.";
            return;
        }

        // ניקוי הודעת שגיאה
        errorMsg.textContent = "";

        // שמירת שם העיר ב-localStorage
        localStorage.setItem("selectedCity", city);

        // מעבר לעמוד result
        window.location.href = "result.html";
    };

    // אירוע לחיצה על כפתור החיפוש
    searchBtn.addEventListener("click", goToResult);

    // אירוע לחיצה על Enter בשדה הקלט
    cityInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") goToResult();
    });

    // ניקוי הודעת שגיאה בזמן הקלדה
    cityInput.addEventListener("input", () => {
        errorMsg.textContent = "";
    });
}


// פונקציה אסינכרונית שרצה מיד עם טעינת הדף
(async () => {

    // קבלת אלמנטים מהדף
    const cityTitle = document.getElementById("cityTitle");

    // שליפת העיר שנשמרה
    const savedCity = localStorage.getItem("selectedCity");

    // אם אין עיר או אין אלמנט – יציאה
    if (!cityTitle || !savedCity) return;

    // הצגת שם העיר בדף
    cityTitle.textContent = savedCity;

    // ===== Weather =====
    try {
        const weatherData = await getWeather(savedCity);
        renderWeather(weatherData); // הצגת נתוני מזג אוויר
    } catch (err) {
        document.getElementById("weatherContent").innerHTML =
            "<p>Weather data not available.</p>";
    }

    // ===== Attractions =====
    try {
        const attractions = await getAttractionsTop3(savedCity);
        renderAttractions(attractions); // הצגת אטרקציות
    } catch (err) {
        document.getElementById("attractionsContent").innerHTML =
            "<p>Attractions data not available.</p>";
    }

    // ===== Hotels =====
    try {
        const hotels = await getHotelsTop3(savedCity);
        renderHotels(hotels); // הצגת מלונות
    } catch (err) {
        document.getElementById("hotelsContent").innerHTML =
            "<p>Hotels data not available.</p>";
    }

    // ===== Map =====
    try {
        const location = await geocodeCity(savedCity);
        renderMap(location); // הצגת מפה
    } catch (err) {
        document.getElementById("mapContent").innerHTML =
            "<p>Map not available.</p>";
    }

})();