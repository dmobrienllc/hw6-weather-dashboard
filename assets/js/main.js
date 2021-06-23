$(function() {

    let storedSearchCities;
    let searchNamesArray = [];

    //is this bad design? Get parent div
    let cardParentDiv = $("div.card-row");

    function fetchForecastData(city){
        const apiKey = "1602cf34096adba596dbd657831f5ce9";

        let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" 
                            + city + "&units=imperial&cnt=40&appid=" + apiKey;
        fetch(queryURL)
        .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayForecastData(data);
            });
        } else {
            console.log('Not OK: ' + response.statusText);
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

        citySpan.text(data.city.name);
        //TODO: Format Date using Moment JS
        dateSpan.text(data.list[0].dt_txt);
        tempSpan.text(data.list[0].main.temp + " F°");
        windSpan.text(data.list[0].wind.speed + " MPH");
        humSpan.text(data.list[0].main.humidity + "%");

        //TODO Render color based on how high the value is; apply a special class background
        //Right now I don't think this is coming in  on the data., I could fake something out
        //with the icons maybe?
        uvIndexSpan.text("75");

        let iconCode = data.list[0].weather[0].icon;
        imgEl.attr("src",`http://openweathermap.org/img/w/${iconCode}.png`);
    }

    function displayForecastCards(data){

        console.log(cardParentDiv);
        var cardDiv = document.getElementById("card-row"); 
        //get ride of all divs with remove class
        $('div.remove-card-div').remove()
         
        $(data.list).each(function(index) {
            buildForecastCard(index,this);
          });
    }

    ///Only includes 9AM dates for now, easiest way to just
    //get 5 days out there
    function buildForecastCard(index,input){
    
        let ulSavedCities =   $("#saved-search-cities");
        
        //we don't want the first one as that is the one we built our header
        //date with, then only take 9AM for now. do this more elegantly later
        //for now it works
        if(index>0 && input.dt_txt.includes("09:00:00")){
            let cardDivEl = $("<div>")
                .addClass("col-12 col-md-6 col-lg-2 p-1 bg-dark text-light remove-card-div");
            let h3El = $("<h3>");
            let imgEl = $("<img>");
            let pTempEL = $("<p>");
            let pWindEL = $("<p>");
            let pHumEL = $("<p>");

            console.log(input);
            h3El.text("Date: " + input.dt_txt);

            let iconCode = input.weather[0].icon;
            imgEl.attr("src",`http://openweathermap.org/img/w/${iconCode}.png`);
            imgEl.attr("alt","weather icon");
            imgEl.attr("title","weather icon");
        
            pTempEL.text("Temp: " + input.main.temp + " F°");
            pWindEL.text("Wind: " + input.wind.speed + " MPH");
            pHumEL.text("Humidity: " + input.main.humidity + " %");

            //build structure
            cardDivEl.append(h3El);
            cardDivEl.append(imgEl);
            cardDivEl.append(pTempEL);
            cardDivEl.append(pWindEL);
            cardDivEl.append(pHumEL);
            cardParentDiv.append(cardDivEl);
        }
    }

    //have to create button and append to the list and also store 
    //in local storage
    function saveSearchCity(city){
        const found = searchNamesArray.find(element => element === city);

        if(!found){
            searchNamesArray.push(city);
            let stringifiedArray = JSON.stringify(searchNamesArray);
            localStorage.setItem("stored-cities",stringifiedArray);
            console.log(stringifiedArray);
            alert("Search Item not found, add to array!");
        }else{
            alert("Search Item already existS!");
        }
        buildSavedSearchCityList();
    }

    let buildSavedSearchCityList = function () {
        let ulParentEl = $("ul#saved-search-cities");
        ulParentEl.empty();

        searchNamesArray = JSON.parse(localStorage.getItem("stored-cities"));
        searchNamesArray.sort();

        $(searchNamesArray).each(function(index,item){
            let liEl = $("<li>").attr("id",index);
            let buttonEl = $("<button>").attr("type","button").attr("data-search-city",item)
            buttonEl.addClass("btn btn-outline-success my-2 my-sm-0  saved-search-button");
            buttonEl.text(item);

            liEl.append(buttonEl);
            ulParentEl.append(liEl);
        });
      };

    //initialize main page elements
    function init(){

        //event delegation for saved search cities
        let containerDiv = $("div#saved-search-parent");
        containerDiv.on('click', '.saved-search-button', function (event) {
            let searchCity = $(this).attr("data-search-city");

            fetchForecastData(searchCity);
        });

        let searchButton = $("button.search-button");
        searchButton.on('click',function(event){
            let searchInput = $("input#search-input").val();
            fetchForecastData(searchInput);
            saveSearchCity(searchInput);
        });

        if(!localStorage.getItem("stored-cities")){
            storedSearchCities = localStorage.setItem("stored-cities",""); 
        }else{
            //repopulate the list on refresh
            buildSavedSearchCityList();
        }
    }

    init();
});



  // let storedSearchCities = localStorage.setItem("storedCities","");   

        // var names = [];
        // names[0] = prompt("New member name?");
        // localStorage.setItem("names", JSON.stringify(names));

        // //...
        // var storedNames = JSON.parse(localStorage.getItem("names"));
        // //You can also use direct access to set/get item:

        // localstorage.names = JSON.stringify(names);
        // var storedNames = JSON.parse(localStorage.names);