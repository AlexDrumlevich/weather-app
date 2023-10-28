

export class TemperaturesList {
   #resultSection

    constructor(resultSectionId) {
        this.#resultSection = document.getElementById(resultSectionId)
        this.#resultSection.innerHTML = ""
    }

    showTemperatures(preparedData) {
        
        console.log(preparedData)

        const innerHTML = `
            <header>${preparedData.city}</heder>
            ${this.#getDateList(preparedData.data)}
        `
        console.log(innerHTML)
        this.#resultSection.innerHTML = innerHTML
    }

    #getDateList(data) {
        
        return data.reduce((res, element) => {
           
            console.log(element.date)
            res +=
            `<div>
                <p>${element.date}</p>
                <ul>
                    ${this.#getHourTempList(element.values)}
                </ul>
            </div>`
            
           
            return res
        }, "") 
    }

    #getHourTempList(values) {
        return `<ul>
            ${values.reduce((res, element) => {
               
                res += 
                `<li>
                    <span>${element.time}</span>
                    <span>${element.tempeature}</span>
                </li>`
                
                return res
            }, "")}
        </ul>`
    }
}