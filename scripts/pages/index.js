    async function init() {
        //faire un topo sur await sur le cahier pour ne pas refaire l'erreur
        const photographers = await dataPhotographerApi()
        const photographersSection = document.querySelector(".photographer_section")
        allID = photographers.getAllId()
        allID.forEach( (elt) => {
            const photographer = photographers.getPhotographerById(elt)
            const template = photographerTemplate(photographer)
            photographersSection.appendChild(template.cardIndexPage())
        })

    }
    
    init();