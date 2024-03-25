import {getDataPhotographerApi} from '../api/api.js'
import {photographerTemplate} from '../templates/photographer.js'

async function init() {
    const photographers = await getDataPhotographerApi()
    const photographersSection = document.querySelector('.photographer_section')
    const allID = photographers.getAllId()
    allID.forEach( (elt) => {
        const photographer = photographers.getPhotographerById(elt)
        const template = photographerTemplate(photographer)
        photographersSection.appendChild(template.cardIndexPage())
    })
}
    
init()