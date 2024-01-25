function idRecover(){
    const urlStr=window.location.href
    const urlObj=new URL(urlStr)
    return urlObj.search.split("=")[1]
}

async function getPhotographers() {
    let photographers = await fetch("/data/photographers.json")
    photographers = await photographers.json()
    return photographers.photographers
}

function getThisPhotographer(id, data) {
    const result = {}

    data.forEach(element => {
        if(element.id==id){
            Object.assign(result,element)
        }
    })

    function cardDOM(){
        const {name, portrait, tagline, city, country } = result
        const section = document.createElement( 'section' )
        section.classList.add("photograph-header")
        const picture = `assets/photographers/Photographers_ID_Photos/${portrait}`
        const identity =`
                        <div class="name">
                            <h2>${name}</h2>
                            <h3>${city}, ${country}</h3>
                            <p class="tagline">${tagline}</p>
                        </div>
                        <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
                        <div class="profil">
                            <img src=${picture} class="profil_img">
                        </div>
        `
        section.innerHTML = identity
        return (section)
    }
    return {result, cardDOM}
}

async function init(){
    const photographerIdentity = document.getElementById("main")
    const allPhotographers = await getPhotographers()
    const thisPhotographer = getThisPhotographer(idRecover(),allPhotographers)
    photographerIdentity.appendChild(thisPhotographer.cardDOM())
}

init()