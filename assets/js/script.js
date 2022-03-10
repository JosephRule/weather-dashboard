var city_list = ["Chicago", "San Diego"]
key = "2c473e169f8a220e8e39ee2313398215"
city = "Chicago"


var getLatLong = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="
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

                    console.log("5 day values")
                    i = 0
                    console.log("date" + data.daily[i].dt)
                    console.log("clouds" + data.daily[i].clouds)
                    console.log("temp K" + data.daily[i].temp.day)
                    console.log("temp F" + ((data.daily[i].temp.day - 273.15) * 9/5 + 32) )
                    console.log("humidity" + data.daily[i].humidity)
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
        .text("Temp: " + ((data.current.temp - 273.15) * 9/5 + 32) +" F")
    var windEl = $("<p>")
        .text("Wind: " + data.current.wind_speed + " MPH")
    var humidityEl = $("<p>")
        .text("Humidity: " + data.current.humidity + " %")
    if (data.current.uvi  > 1) {
        uviClass = "red"
    }
    else {
        uviClass = "blue"
    }
    var uviEl = $("<p>")
        .text("UVI: " + data.current.uvi)

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

var searchButtonHandler = function(event) {
    
}

getLatLong(city)