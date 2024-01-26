function photographerTemplate(data) {

    function getPhotographer() {    
        const { id, name, portrait, tagline, price, city, country } = data
        const picture = `assets/photographers/Photographers_ID_Photos/${portrait}`
        const url= "/photographer.html"
        const article = document.createElement( 'article' );
        const img =`
                    <a href="/photographer.html?id=${id}" class="photographer">
                        <div class="profil">
                            <img src=${picture} class="profil_img" alt="">
                        </div>
                        <h2>${name}</h2>
                    </a>
                    <h3>${city}, ${country}</h3>
                    <p class="tagline">${tagline}</p>
                    <p class="price">${price}€/jour</p>
        `
        article.innerHTML = img;
        return (article);
    }

    function getPhotographerById(idKey){
        const result = data.photographers.filter(elt => elt.id == idKey)
        const {name, portrait, tagline, city, country, price } = result[0]
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

    function getPhotographerMedia(IdKey){
        const result = data.media
        const resultById = result.filter(elt => elt.photographerId == IdKey)
        return resultById
    }

    return {getPhotographer, getPhotographerById, getPhotographerMedia}
}