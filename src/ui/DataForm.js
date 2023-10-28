
import { showErrorMessage } from "./errorMessage.js"

export class DataForm {
    //TODO
    #formElement
    #inputElements
    #dateFromElement
    #dateToElement
    #hoursFromElement
    #hoursToElement
    #selectCityElement
    #errorMessageElement
    #selectCityOptions

    //......
    constructor (params) {
        //TODO
        this.#formElement = document.getElementById(params.formElementId)
        this.#inputElements = document.querySelectorAll(`#${params.formElementId} [name]`)
        this.#dateFromElement =document.getElementById(params.dateFromElementId)
        this.#dateToElement =document.getElementById(params.dateToElementId)
        this.#hoursFromElement =document.getElementById(params.hoursFromElementId)
        this.#hoursToElement =document.getElementById(params.hoursToElementId)
        this.#errorMessageElement = document.getElementById(params.errorMessageElementId)
        this.#selectCityElement = document.getElementById(params.selectCityElementId)
        this.#selectCityOptions = params.selectCityOptions
        this.#onChange()
        this.#addSelectCityOptions()
    }

    #addSelectCityOptions() {
        this.#selectCityElement.innerHTML = 
            `<option value hidden selected disabled> Select city </option>
            ${this.#selectCityOptions.reduce((res, city) => res += `<option value="${city}">${city}</option>`, "")}`
        
    }

    addHandler(processFun) {
    
        this.#formElement.addEventListener("submit", (event) => {
            event.preventDefault()
            const result = Array.from(this.#inputElements)
                .reduce((res, element) => {
                    res[element.name] = element.value
                    return res
                }, {})
            processFun(result)    
        })
    }

    #onChange() {
        this.#hoursFromElement.addEventListener("change", this.#checkMimMaxHours.bind(this, this.#hoursFromElement, this.#hoursToElement))
        this.#hoursToElement.addEventListener("change",  this.#checkMimMaxHours.bind(this, this.#hoursFromElement, this.#hoursToElement))
        this.#dateFromElement.addEventListener("change",  this.#checkMimMaxDate.bind(this, this.#dateFromElement, this.#dateToElement))
        this.#dateToElement.addEventListener("change",  this.#checkMimMaxDate.bind(this, this.#dateFromElement, this.#dateToElement))
    }

    #checkMimMaxHours(min, max, event) {
        if(min.value != "" && max.value != "" && +min.value > +max.value) {
            showErrorMessage(event.target, "from value has to be less or equal than to value", this.#errorMessageElement)
        }
    }
    #checkMimMaxDate(min, max, event) {
        const minDate = Date.parse(min.value)
        const maxDate = Date.parse(max.value)
        if(minDate !== undefined && maxDate !== undefined && minDate > maxDate) {
            showErrorMessage(event.target, "from value has to be less or equal than to value", this.#errorMessageElement)
        }
    }

}