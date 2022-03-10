var city_list = ["Chicago", "San Diego"]
key = "2c473e169f8a220e8e39ee2313398215"

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
                    console.log("current values:")
                    console.log("temp K" + data.current.temp)
                    console.log("temp F" + ((data.current.temp - 273.15) * 9/5 + 32) )
                    console.log("wind" + data.current.wind_deg)
                    console.log("humidity" + data.current.humidity)
                    console.log("uvi" + data.current.uvi)

                    console.log("5 day values")
                    i = 0
                    console.log("date" + data.daily[i].dt)
                    console.log("clouds" + data.daily[i].clouds)
                    console.log("temp K" + data.daily[i].temp.day)
                    console.log("temp F" + ((data.daily[i].temp.day - 273.15) * 9/5 + 32) )
                    console.log("humidity" + data.daily[i].humidity)

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

city = "Chicago"
getLatLong(city)