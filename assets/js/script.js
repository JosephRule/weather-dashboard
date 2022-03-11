
key = "2c473e169f8a220e8e39ee2313398215"



var loadOrInitalizeCityList = function() {
    cityList = JSON.parse(localStorage.getItem("cityList"))

    if (!cityList) {
        cityList = ["Chicago", "San Diego"]
    }

    for (var i=0; i<cityList.length; i++) {

        createCityButton(cityList[i])
    }
    return cityList
}

var getLatLon = function(city) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q="
                + city + "&limit=1&appid=" + key

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data){
                    getWeather(data[0].lat, data[0].lon)
                });
            }
            else {
                alert("Error: city not found")
            }
        })
        .catch(function(error){
            alert("unable to connect to openweathermap.com")
        });

};

var getWeather = function(lat, lon) {
    console.log("lat = " + lat +" lon = " + lon)
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="
                 + lat + "&lon=" + lon
                 + "&exclude=minutely,hourly,alerts&appid=" + key
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data){

                    console.log(data)
                    $(".current-container").empty()
                    $(".forecast-container").empty()
                    createPresent(data);
                    for (var i = 0; i<5; i++) {
                        createForecastCard(data.daily[i])
                    }
                });
            }
            else {
                alert("error: city not found")
            }
        })
        .catch(function(error) {
            alert("unable to retrieve weather")
        });
};

var createPresent = function(data) {
    var titleEl = $("<h2>")
        .text(city + ":   " + moment.unix(data.current.dt).format("MMMM/DD/YYYY"))
    console.log(data.current.dt)
    var tempEl = $("<p>")
        .text("Temp: " + Math.round((data.current.temp - 273.15) * 9/5 + 32) +" F")
    var windEl = $("<p>")
        .text("Wind: " + data.current.wind_speed + " MPH")
    var humidityEl = $("<p>")
        .text("Humidity: " + data.current.humidity + " %")
    if (data.current.uvi  < 2) {
        uviClass = "bg-success"
    }
    else if (data.current.uvi < 5) {
        uviClass = "bg-warning"
    }
    else {
        uviClass = "bg-danger"
    }
    var uviEl = $("<p>")
        .text("UVI: " + data.current.uvi)
        .addClass(uviClass)

    $(".current-container").append(titleEl, tempEl, windEl, humidityEl, uviEl);
}

var createForecastCard = function(dailyData) {

    var cardEl = $("<div>").addClass("card")
    var dateEl = $("<p>").text(moment.unix(dailyData.dt).format("MMMM/DD/YYYY"))
    var tempEl = $("<p>").text("Temp: " + Math.round((dailyData.temp.day - 273.15) * 9/5 + 32) + "F" )
    var windEl = $("<p>").text("Wind: " + dailyData.wind_speed + " MPH")
    var humidityEl = $("<p>").text("Humidity: " + dailyData.humidity + " %")

    cardEl.append(dateEl, tempEl, windEl, humidityEl)
    $(".forecast-container").append(cardEl)
}

var createCityButton = function(city) {
    var cityBtnEl = $("<button>").text(city).addClass("city-btn")
    $(".list-group").append(cityBtnEl)
}

$(document).on("click", ".btn-primary", function() {
    city = $(this).prev().val()
    getLatLon($(this).prev().val())
    createCityButton(city)
    cityList.push(city)
    localStorage.setItem("cityList", JSON.stringify(cityList))

})

$(document).on("click", ".city-btn", function() {
    console.log($(this).text())
    city = $(this).text()
    getLatLon(city)
})


cityList = loadOrInitalizeCityList()
