
export class WeatherDataProcessor {
#cityGeocodes
#currentCityGeocode
constructor() {
    this.#cityGeocodes = [
        {city:"Rehovot", latitude:31.046, longitude:34.851},
        {city:"Haifa", latitude:31.046, longitude:34.851}, 
        {city: "Viena", latitude:48.205, longitude:16.37},
        {city: "Lubliana", latitude:46.051, longitude:14.505},
        {city:"Or Yehuda", latitude:31.046, longitude:34.851},
    ]
}
    getCities() {
        return this.#cityGeocodes.map(e => e.city)
    }

   
    getData(requestObject) {
        //{city, dateFrom, dateTo, hoursFrom, hoursTo}
        const url = this.getUrl(requestObject);
        
        const promiseResponse = fetch(url);
        return this.processData(promiseResponse.then(response => response.json()), requestObject);

    }
   
    getUrl(requestObject) {
        //TODO creates URL for request and returns it
        const baseUrl = "https://api.open-meteo.com/v1/gfs?";
        const baseParams = "&hourly=temperature_2m&timezone=IST&";
        
        this.#cityGeocodes.every(element => {
            if(element.city == requestObject.city) {
                this.#currentCityGeocode = element
                return false
            }
            return true
        } )
        const url = `${baseUrl}latitude=${this.#currentCityGeocode.latitude}&longitude=${this.#currentCityGeocode.longitude}${baseParams}start_date=${requestObject.dateFrom}&end_date=${requestObject.dateTo}`
        return url
    }

    processData(promiseData, requestObject) {
        
        return promiseData.then(data => {
            var times = []
            var temperatures = []
               
            for(let i = 0; i < data.hourly.time.length / 24; i++) {
               times.push(...data.hourly.time.slice(+requestObject.hoursFrom + (24 * i), +requestObject.hoursTo + (24 * i)))
                temperatures.push(...data.hourly.temperature_2m.slice(+requestObject.hoursFrom + (24 * i), +requestObject.hoursTo + (24 * i)))
            }
            
            let preparedData = {city: this.#currentCityGeocode.city, data: []}
                

            let currentDate
            let indexDate = -1
            times.forEach((element, index)=> {
                const dateTime = element.split("T")
                if(dateTime[0] == currentDate) {
                    preparedData.data[indexDate].values.push({time: dateTime[1], tempeature: temperatures[index]})
                } else {
                    preparedData.data.push({date: dateTime[0], values: [{time: dateTime[1], tempeature: temperatures[index]}]}) 
                    currentDate = dateTime[0]
                    indexDate ++
                }
            });
            return preparedData
       })
    }
}

/*
async function displayTimesTemperatures(url) {
    const response = await fetch(url);
    const data =  await response.json();
    console.log(data.hourly.time);
    console.log(data.hourly.temperature_2m)
}
function displayTimesTemperaturesThens(url) {
    const promiseResponse = fetch(url);
    const promiseData = promiseResponse.then(response => response.json());
    promiseData.then(data => {
        console.log(data.hourly.time);
        console.log(data.hourly.temperature_2m)
    })
}

**********
async function callMe() {
    try {
        console.log(1);
        const p1 = crazyFunction(100000, "crazy1000");
        const p2 = crazyFunction(2000, "crazy2000");
        Promise.race([p1, p2]).then((messages) => console.log(messages));
    } catch (error) {
        console.log("error")
    }

}
function crazyFunction(timeout, message) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            
           res(message)
        }, timeout);
    });
}
callMe();
*/