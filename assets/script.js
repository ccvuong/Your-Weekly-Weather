let cityHistory = []
let lastCitySearched = ""

// api call 
let getCityWeather = function (city) {

    // using imperial units (F degrees)
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ad4235f3227118f78d5f5697064dba72&units=imperial";

    // asking the api to grab weather information; if successful then weather data will display; if unsuccessful then an alert will pop up;
    fetch(apiUrl)

        .then(function (response) {

            if (response.ok) {
                response.json().then(function (data) {
                    displayWeather(data);
                });

            } else {
                alert("Oh no! " + response.statusText);
            }
        })

};

// when the user submits a city in the search input;
let submit = function (event) {
    // preventDafault stops the page from clearing data;
    event.preventDefault();

    // checking to see if the city input has information to grab or not;
    let cityName = $("#current-city").val().trim();


    if (cityName) {
        getCityWeather(cityName);
        // this will clear the input search bar;
        $("#current-city").val("");
    } else {
        // error will happen if user tries to search a city without inputting a city in the search bar;
        alert("No city name entered");
    }
};

// showing weather data via HTML
let displayWeather = function (weatherData) {

    // format and display the values
    $("#selected-city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);
    $("#temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + "°F");
    $("#humidity").text("Humidity: " + weatherData.main.humidity + "%");
    $("#wind-speed").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");


    // asking api for weekly weather; ah my brain...
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=ad4235f3227118f78d5f5697064dba72&units=imperial")

        .then(function (response) {
            response.json().then(function (data) {

                // updates weather to the city selected by user;
                $("#weekly-forecast").empty();

                for (i = 7; i <= data.list.length; i += 8) {

                    // puts current weather and date for selected city;
                    let workWeek = `
                    <div class="col-md-2 m-2 py-3 card text-white bg-primary">
                        <div class="card-body p-1">
                            <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                            <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                            <p class="card-text">Temp: ` + data.list[i].main.temp + `</p>
                            <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
                        </div>
                    </div>
                    `;

                    // updates the HTML section of weekly-forecast;
                    $("#weekly-forecast").append(workWeek);
                }
            })
        });

    // saves the last city searched;
    lastCitySearched = weatherData.name;
    savecityHistory(weatherData.name);


};

// function to save the city search history to local storage;
let savecityHistory = function (city) {
    if (!cityHistory.includes(city)) {
        cityHistory.push(city);
        $("#city-searched").append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>")
    }

 
    localStorage.setItem("cityHistoryWeather", JSON.stringify(cityHistory));
    localStorage.setItem("lastCitySearched", JSON.stringify(lastCitySearched));

    loadcityHistory();
};

// function to load saved city search history from local storage;
let loadcityHistory = function () {
    cityHistory = JSON.parse(localStorage.getItem("cityHistoryWeather"));
    lastCitySearched = JSON.parse(localStorage.getItem("lastCitySearched"));

    // keeps week city weather saved on webpage;
    if (!cityHistory) {
        cityHistory = []
    }

    if (!lastCitySearched) {
        lastCitySearched = ""
    }

    // if the search history is empty then this will stay empty;
    $("#city-searched").empty();

    for (i = 0; i < cityHistory.length; i++) {

        // keeps the search history of cities saved on webpage;
        $("#city-searched").append("<a href='#' class='list-group-item list-group-item-action' id='" + cityHistory[i] + "'>" + cityHistory[i] + "</a>");
    }
};

loadcityHistory();

// most recent searches
if (lastCitySearched != "") {
    getCityWeather(lastCitySearched);
}

//checks to see if the form is used and is user clicks on a previously searched city to pull the weather information again;
$("#search-bar-form").submit(submit);
$("#city-searched").on("click", function (event) {
    let prevCity = $(event.target).closest("a").attr("id");
    getCityWeather(prevCity);
});