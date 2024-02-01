class formatPicture {
    constructor(mediaData){
        this._id = mediaData.id
        this._photographerId = mediaData.photographerId
        this._title = mediaData.title
        this._image = mediaData.image
        this._likes = mediaData.likes
        this._date = mediaData.date
        this._price = mediaData.price
    }
    
    get mediaHtml(){
        const htmlElt = `
        <img class="card-image"
        src= "assets/photographers/${this._photographerId}/${this._image}">
        <div class="card-title">
        <p>${this._title}</p> <span class="likes"><p>${this._likes}</p><i class="fa-solid fa-heart"></i></span>
        </div>`
        return htmlElt
    }
}

class formatMovie {
    constructor(mediaData){
        this._id = mediaData.id
        this._photographerId = mediaData.photographerId
        this._title = mediaData.title
        this._video = mediaData.video
        this._likes = mediaData.likes
        this._date = mediaData.date
        this._price = mediaData.price
    }
    
    get mediaHtml(){
        const htmlElt = `
        <video class="card-image"
             src= "assets/photographers/${this._photographerId}/${this._video}">
        </video>
        <div class="card-title">
        <p>${this._title}</p> <span class="likes"><p>${this._likes}</p><i class="fa-solid fa-heart"></i></span>
        </div>`
        return htmlElt
    }
}