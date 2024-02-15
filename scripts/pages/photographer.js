function idRecover(){
    const urlStr=window.location.href
    const urlObj=new URL(urlStr)
    return urlObj.search.split("=")[1]
}

async function displayProfil(photographerData, htmlTag){
    const template = photographerTemplate(photographerData)
    htmlTag.innerHTML = template.profilPhotographerPage()
}

function displayPortfolio(mediaById, sortMode){
    const photographerData = Object.values(mediaById)
    const photographerMain = document.getElementById("main")
    const folioSectionPresence = document.querySelector(".folioSection")
    if(folioSectionPresence){
        folioSectionPresence.remove()
    }
    const folioSection = document.createElement("section")
    folioSection.classList.add("folioSection")
    let photographerDataSorted = sortBy(photographerData)
    let sortedMedia = []
    switch (sortMode) {
        case "byDate":
            sortedMedia = photographerDataSorted.byDate()
            break

        case "byPopularity":
            sortedMedia = photographerDataSorted.byPopularity()
            break;

        case "byTitle":
            sortedMedia = photographerDataSorted.byTitle()
            break;
    }
    
    sortedMedia.forEach(elt => {
        const callbackFactory=factoryPattern(elt)
        const cardFolio= cardFolioTemplate(callbackFactory)
        folioSection.appendChild(cardFolio)
    });
    photographerMain .appendChild(folioSection)
    displayMediaInModal(mediaById)
}


function factoryPattern(mediaData){
    if(mediaData.image){
        const picture = new formatPicture(mediaData)
        return picture 
    }
    if (mediaData.video){
        const movie = new formatMovie(mediaData)
        return movie 
    }
}

function dropbox(mediaById){
    const dropbox = document.querySelectorAll('#dropbox a')
    const splitter = document.querySelectorAll('#dropbox div')
    const arrow = document.querySelector(".fa-solid")

    for (let cpt=0; cpt<3; cpt++){
        dropbox[cpt].addEventListener("click", (event)=>{

            if (dropbox[1].className==="drop_close"){
                for (let index = 1; index < dropbox.length; index++) {
                    dropbox[index].classList.add('drop_open')
                    dropbox[index].classList.remove('drop_close')
                    
                    splitter[index-1].classList.add('on')

                    arrow.classList.remove('fa-chevron-down')
                    arrow.classList.add('fa-chevron-up')
                }
                return
            }

            if (dropbox[1].className==="drop_open"){
                for (let index = 1; index < dropbox.length; index++) {
                    dropbox[index].classList.add('drop_close')
                    dropbox[index].classList.remove('drop_open')
                    
                    splitter[index-1].classList.remove('on')

                    arrow.classList.remove('fa-chevron-up')
                    arrow.classList.add('fa-chevron-down')
                    
                }
                const outchoose = event.target.innerText
                event.target.innerText = dropbox[0].innerText
                dropbox[0].innerHTML = outchoose + "<span class=\"fa-solid fa-chevron-down\"></span>"
                switch (outchoose) {
                    case "Date":
                        displayPortfolio( Object.values(mediaById),"byDate") 
                        console.log("byDate")
                        break;
                        
                    case "Popularité":
                        displayPortfolio( Object.values(mediaById),"byPopularity") 
                        console.log("byPopularity")
                        break;
                    case "Titre":
                        displayPortfolio( Object.values(mediaById),"byTitle") 
                        console.log("byTitle")
                        break;
                }
                return
            }
        })
    }
}

function displayTotalLike(mediaById){
    const photographerLikes = document.getElementById("photographerLikes")
    const total = Object.values(mediaById).reduce((sum,  {likes} ) => sum + likes, 0)

    photographerLikes.innerText = String(total)
}

async function addOneLike (mediaById){
    const addLike = document.querySelectorAll(".addLike")
    for(let cpt=0; cpt<addLike.length; cpt++){
        addLike[cpt].addEventListener("click",(event)=>{
            const mediaId = event.target.parentElement.parentElement.parentElement.id
            const likes = mediaById[mediaId].likes + 1
            mediaById[mediaId].likes = likes
            event.target.parentElement.children[0].innerText = String(likes)

            displayTotalLike(mediaById)
        })
    }
}

function displayMediaInModal (mediaById) {
    const mediaToShow = document.querySelectorAll(".fS__mediaCard-img")
    const carouselModal = document.querySelector(".carouselLayout")
    
    for(let cpt=0; cpt<mediaToShow.length; cpt++){
        mediaToShow[cpt].addEventListener("click",(event)=>{
            const mediaId = event.target.parentElement.id
            const callbackFactory = factoryPattern(mediaById[mediaId])
            mediaInCarouselTemplate(callbackFactory)
            carouselModal.style.display="block"
        })
    }
}

function previousMediaInModal (mediaById) {
    const previousIcon = document.getElementById("previousMedia")
    mediaInCarousel = document.querySelector(".dMM__mediaContents")
    previousIcon.addEventListener("click",()=>{
        const mediaId = mediaInCarousel.id
        const tableOfIndex = Object.keys(mediaById)
        let indexPreviousMedia = tableOfIndex.indexOf(mediaId)-1
        if (indexPreviousMedia<0){
            indexPreviousMedia=tableOfIndex.length-1
        }
        const idOfPreviousMedia = tableOfIndex[indexPreviousMedia]
        const callbackFactory=factoryPattern(mediaById[idOfPreviousMedia])
        mediaInCarouselTemplate(callbackFactory)
    })
}

function nextMediaInModal (mediaById) {
    const previousIcon = document.getElementById("nextMedia")
    mediaInCarousel = document.querySelector(".dMM__mediaContents")
    previousIcon.addEventListener("click",()=>{
        const mediaId = mediaInCarousel.id
        const tableOfIndex = Object.keys(mediaById)
        let indexPreviousMedia = tableOfIndex.indexOf(mediaId)+1
        if (indexPreviousMedia>tableOfIndex.length-1){
            indexPreviousMedia=0
        }
        const idOfPreviousMedia = tableOfIndex[indexPreviousMedia]
        const callbackFactory=factoryPattern(mediaById[idOfPreviousMedia])
        mediaInCarouselTemplate(callbackFactory)
    })
}

function closeCarouselModal(){
    const carouselModal = document.querySelector(".carouselLayout")
    carouselModal.style.display="none"
}

function sortBy(mediaById){
    const data = Object.values(mediaById)

    function byDate(){
        data.sort( (a,b)=>{ 
            return a.date.localeCompare(b.date)
        })
        return data
    }

    function byPopularity(){
        data.sort( (a,b)=>{ 
            return a.likes - b.likes
        })
        return data
    }

    function byTitle(){
        data.sort( (a,b)=>{ 
            return a.title.localeCompare(b.title)
        })
        return data
    }

    

    return {byDate, byPopularity, byTitle}
}

async function init(){
    const photographers = await dataPhotographerApi()
    idKey=idRecover()
    
    const photographer = photographers.getPhotographerById(idKey)
    const photographerSection = document.querySelector(".photographHeader")
    displayProfil( photographer, photographerSection)
    
    const mediaPhotographer = photographers.getPhotographerMedia(idKey)

    const mediaById = mediaPhotographer.reduce((acc, media) => {
        acc[media.id] = media

        return acc
    }, {})

    displayPortfolio( mediaById,"byPopularity")   

    displayTotalLike(mediaById)
    addOneLike(mediaById)

    // displayMediaInModal(mediaById)
    previousMediaInModal(mediaById) 
    nextMediaInModal(mediaById)

    dropbox(mediaById)
}

init()

