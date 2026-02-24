const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const errorMsg = document.getElementById("errorMsg");

if (searchBtn && cityInput) {

    const goToResult = () => {
        const city = cityInput.value.trim();

        if (city === "") {
            errorMsg.textContent = "Please enter a1 city name.";
            return;
        }

        errorMsg.textContent = ""; // يمسح الرسالة إذا كتب اسم

        localStorage.setItem("selectedCity", city);
        window.location.href = "result.html";
    };

    searchBtn.addEventListener("click", goToResult);

    cityInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") goToResult();
    });

    cityInput.addEventListener("input", () => {
        errorMsg.textContent = "";
    });
}

(async () => {
    const cityTitle = document.getElementById("cityTitle");
    const savedCity = localStorage.getItem("selectedCity");

    if (!cityTitle || !savedCity) return;

    cityTitle.textContent = savedCity;

    // Weather
    try {
        const weatherData = await getWeather(savedCity);
        renderWeather(weatherData);
    } catch (err) {
        document.getElementById("weatherContent").innerHTML =
            "<p>Weather data not available.</p>";
    }

    // Attractions
    try {
        const attractions = await getAttractionsTop3(savedCity);
        renderAttractions(attractions);
    } catch (err) {
        document.getElementById("attractionsContent").innerHTML =
            "<p>Attractions data not available.</p>";
    }

    // Hotels
    try {
        const hotels = await getHotelsTop3(savedCity);
        renderHotels(hotels);
    } catch (err) {
        document.getElementById("hotelsContent").innerHTML =
            "<p>Hotels data not available.</p>";
    }

    // Map
    try {
        const location = await geocodeCity(savedCity);
        renderMap(location);
    } catch (err) {
        document.getElementById("mapContent").innerHTML =
            "<p>Map not available.</p>";
    }
})();