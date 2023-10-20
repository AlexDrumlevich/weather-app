
export class WeatherDataProcessor {
#cityGeocodes
constructor() {
    this.#cityGeocodes = [{city:"Rehovot", latitude:31.046, longitude:34.851},
     {city:"Haifa", latitude:31.046, longitude:34.851}, {city: "Jerusalem"},
    {}, {}] //todo fill this array from Internet
}
    getData(requestObject) {
        //{city, dateFrom, dateTo, hoursFrom, hoursTo}
        const url = this.getUrl(requestObject);
        const promiseResponse = fetch(url);
        return this.processData(promiseResponse.then(response => response.json()));

    }
    getUrl(requestObject) {
        //TODO creates URL for request and returns it
    }
    processData(promiseData) {
        return promiseData(data => {
            //TODO
           // return {city, objects: [{date,hour,temperature},...]}
        })
    }
}