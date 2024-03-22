function photographerTemplate(data) {
    const { id, name, portrait, tagline, price, city, country } = data

    function cardIndexPage() {   
        const picture = `assets/photographers/Photographers_ID_Photos/${portrait}`
        // const url= "/photographer.html"
        const article = document.createElement( 'article' )
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
        article.innerHTML = img
        return (article)
    }

    function profilPhotographerPage(){
        const picture = `assets/photographers/Photographers_ID_Photos/${portrait}`
        const identity =`
                        <div id="name" class="name">
                            <h2>${name}</h2>
                            <h3>${city}, ${country}</h3>
                            <p class="tagline">${tagline}</p>
                        </div>
                        <button 
                            class="contactButton"
                            aria-haspopup="dialog"
                            aria-controls="contactLayout"
                            aria-label="Contact Mi"
                            >Contactez-moi
                        </button>
                        <div class="profil">
                            <img src=${picture} class="profil_img" alt="${name}">
                        </div>
        `
        return identity
    }
    return {cardIndexPage, profilPhotographerPage}
}

function cardFolioTemplate(mediaObj){
    const article = document.createElement('article')
    article.classList.add('fS__mediaCard')
    article.id = mediaObj.mediaId
    article.innerHTML = mediaObj.mediaHtml
    article.children[0].classList.add('fS__mediaCard-img')
    const divComment = document.createElement('div')
    divComment.classList.add('fS__mediaCard-com')
    divComment.innerHTML = `
                            <p aria-hidden="true">${mediaObj.mediaTitle}</p>
                            <span>
                                <p aria-hidden="true">${mediaObj.Likes}</p>
                                <i class="heart addLike" tabindex="0" aria-label="${mediaObj.Likes} like, validate to add like"></i>
                            </span>`
    article.appendChild(divComment)
    return article
}

function mediaInCarouselTemplate(mediaObj){
    const carousel = document.querySelector('.dMM__mediaContents-img')
    mediaObj.controls = true
    carousel.id = mediaObj.mediaId
    carousel.innerHTML = mediaObj.mediaHtml
    carousel.children[0].tabIndex=2
    const title = document.createElement('p')
    title.innerText = mediaObj.mediaTitle
    title.classList.add('dMM__mediaContents-title')
    carousel.appendChild(title)
}

export {photographerTemplate, cardFolioTemplate, mediaInCarouselTemplate}