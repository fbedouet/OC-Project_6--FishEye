function photographerTemplate(data) {
    const { id, name, portrait, tagline, price, city, country } = data

    function cardIndexPage() {   
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

    function profilPhotographerPage(){
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
        return identity
    }
    return {cardIndexPage, profilPhotographerPage}
}

function cardMediaTemplate(mediaObj){
    const article = document.createElement('article')
    article.classList.add("thumbnail")
    article.innerHTML = mediaObj.mediaHtml
    return article
}