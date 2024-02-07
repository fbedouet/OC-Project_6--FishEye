class formatPicture {
    constructor(mediaData){
        this._id = mediaData.id
        this._photographerId = mediaData.photographerId
        this._title = mediaData.title
        this._image = mediaData.image
        this._likes = mediaData.likes
        this._date = mediaData.date
        this._price = mediaData.price
        this._totalLikes = 0
    }
    
    get mediaHtml(){
        const htmlElt = `
        <img class="fS__mediaCard-img"
        src= "assets/photographers/${this._photographerId}/${this._image}">`
        return htmlElt
    }

    get commentsHtml(){
        const htmlElt=`
            <p>${this._title}</p>
            <span>
                <p>${this._likes}</p>
                <i class="heart addLike"></i>
            </span>`
        return htmlElt
    }

    get mediaId(){
        return this._id
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
        <video class="fS__mediaCard-img"
             src= "assets/photographers/${this._photographerId}/${this._video}">
        </video>`
        return htmlElt
    }

    get commentsHtml(){
        const htmlElt=`
        <p>${this._title}</p>
        <span>
            <p>${this._likes}</p>
            <i class="heart addLike"></i>
        </span>`
        return htmlElt
    }

    get mediaId(){
        return this._id
    }
}