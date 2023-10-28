
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