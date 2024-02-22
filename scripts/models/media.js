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
        <img src= "assets/photographers/${this._photographerId}/${this._image}">`
        return htmlElt
    }

    get mediaId(){
        return this._id
    }

    get Likes() {
        return this._likes
    }

    get mediaTitle(){
        return this._title
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
        this._hasControls = false
    }
    
    get mediaHtml(){
        const htmlElt = `
        <video ${this._hasControls ? 'controls' : ''}
             src= "assets/photographers/${this._photographerId}/${this._video}">
        </video>`
        return htmlElt
    }

    set controls (display=false) {
        if (display){
            this._hasControls = true
        }
    }

    get Likes() {
        return this._likes
    }

    get mediaId(){
        return this._id
    }

    get mediaTitle(){
        return this._title
    }
}

class ContactForm {
    constructor(form){
        this._first = form[0].value
        this._last = form[1].value
        this._email = form[2].value
        this._message = form[3].value
    }

    get inputEntries(){
        return {
            first: this._first,
            last: this._last,
            email: this._email,
            message: this._message
        }
    }
}