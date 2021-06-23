$(function() {
 
    function fetchForecastData(city){
        const apiKey = "1602cf34096adba596dbd657831f5ce9";

        let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" 
                            + city + "&units=imperial&cnt=1&appid=" + apiKey;
        fetch(queryURL)
        .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayForecastData(data);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
        })
            .catch(function (error) {
            console.log(error);
        });
    }

    function displayForecastData(data){
        displayForecastToday(data);
        displayForecastCards(data);
    }

    function displayForecastToday(data){
        let citySpan = $("span#today-city");
        let dateSpan = $("span#today-date");
        let imgEl = $("img#header-icon");
        let tempSpan = $("span#today-temp");
        let windSpan = $("span#today-wind");
        let humSpan = $("span#today-humidity");
        let uvIndexSpan = $("span#today-uv-index");

        console.log(citySpan);

        citySpan.text(data.city.name);

        //TODO: Format Date using Moment JS
        dateSpan.text(data.list[0].dt_txt);
        tempSpan.text(data.list[0].main.temp + " F°");
        windSpan.text(data.list[0].wind.speed + " MPH");
        humSpan.text(data.list[0].main.humidity + "%");
        //TODO Render color based on how high the value is; apply a special class background
        uvIndexSpan.text("75");

        let iconCode = data.list[0].weather[0].icon;
        imgEl.attr("src",`http://openweathermap.org/img/w/${iconCode}.png`);
    }

    function displayForecastCards(data){
        console.log(data);
        alert("displayForecastCards: " + data.city.name)
    }

    function buildForecastCard(input){
        let cardDivEl = $("<div>").addClass("class","col-12 col-md-6 col-lg-2 bg-dark text-light");
        let h3El = $("<h3>");
        let imgEl = $("<img>");
        let pTempEL = $("<p>");
        let pWindEL = $("<p>");
        let pHumEL = $("<p>");

        // <div class="col-12 col-md-6 col-lg-2 bg-dark text-light">
        //         <h3>6/24/2021</h3>
        //         <img src="" alt="weather icon" title="weather icon">
        //         <p>Temp: 73.5</p>
        //         <p>Wind: 9.5 mph</p>
        //         <p>Humidity: 44%</p>
        //     </div>
    }

    function saveSearchCity(city){
        alert("saveSearchCIty: " + city);
        //if the city doesn't exist, add it
        // let storedSearchCities = localStorage.setItem("storedCities","");   

        // var names = [];
        // names[0] = prompt("New member name?");
        // localStorage.setItem("names", JSON.stringify(names));

        // //...
        // var storedNames = JSON.parse(localStorage.getItem("names"));
        // //You can also use direct access to set/get item:

        // localstorage.names = JSON.stringify(names);
        // var storedNames = JSON.parse(localStorage.names);
    }

    //initialize main page elements
    function init(){

        //event delegation for saved search cities
        let containerDiv = $("div#saved-search-parent");
        containerDiv.on('click', '.saved-search-button', function (event) {

          let searchCity = $(this).attr("data-search-city");
          fetchForecastData(searchCity);
          saveSearchCity(searchCity);
        });

        let searchButton = $("button.search-button");
        searchButton.on('click',function(event){
            let searchInput = $("input#search-input").val();
            fetchForecastData(searchInput);
        });
    }

    init();
});