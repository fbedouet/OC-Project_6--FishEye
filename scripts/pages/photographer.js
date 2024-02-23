function idRecover(){
    const urlStr=window.location.href
    const urlObj=new URL(urlStr)
    return urlObj.search.split("=")[1]
}

async function displayProfil(photographerData, htmlTag){
    const template = photographerTemplate(photographerData)
    htmlTag.innerHTML = template.profilPhotographerPage()
}

function displayPortfolio(mediaById, sortedIds){
    const sortedMedias = sortedIds.map((id) => mediaById[id])
    const photographerMain = document.getElementById("main")
    const folioSectionPresence = document.querySelector(".folioSection")
    if(folioSectionPresence){
        folioSectionPresence.remove()
    }
    const folioSection = document.createElement("section")
    folioSection.classList.add("folioSection")
 
    sortedMedias.forEach(elt => {
        const callbackFactory=factoryPattern(elt)
        const cardFolio= cardFolioTemplate(callbackFactory)
        folioSection.appendChild(cardFolio)
    });
    photographerMain .appendChild(folioSection)
    addOnlyOneLike (mediaById)
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
    const MEDIA_SORTED = sortBy(mediaById)
    let mediaSorted
    
    for (let cpt=0; cpt<3; cpt++){
        dropbox[cpt].addEventListener("click", (event)=>{
            const arrow = document.querySelector(".fa-solid")
            if (dropbox[1].className==="drop_close"){
                for (let index = 1; index < dropbox.length; index++) {
                    dropbox[index].classList.add('drop_open')
                    dropbox[index].classList.remove('drop_close')
                    
                    splitter[index-1].classList.add('on')

                }

                arrow.classList[1] === 'fa-chevron-down' 
                ?(
                    arrow.classList.remove('fa-chevron-down'),
                    arrow.classList.add('fa-chevron-up')
                                 )
                :null
                return
            }

            if (dropbox[1].className==="drop_open"){
                for (let index = 1; index < dropbox.length; index++) {
                    dropbox[index].classList.add('drop_close')
                    dropbox[index].classList.remove('drop_open')
                    
                    splitter[index-1].classList.remove('on')
                }
                
                const outchoose = event.target.innerText
                event.target.innerText = dropbox[0].innerText
                dropbox[0].innerHTML = outchoose + "<span class=\"fa-solid fa-chevron-down\"></span>"
                switch (outchoose) {
                    case "Date":
                        mediaSorted=MEDIA_SORTED.byDate()
                        break;
                        
                    case "Popularité":
                        mediaSorted=MEDIA_SORTED.byPopularity()
                        break;
                    case "Titre":
                        mediaSorted=MEDIA_SORTED.byTitle()
                        break;
                }
                displayPortfolio( mediaById, mediaSorted) 
                displayMediaInModal(mediaById, mediaSorted)
                return
            }
        })
    }
    mediaSorted = MEDIA_SORTED.byTitle()
    displayPortfolio( mediaById, mediaSorted) 
    displayMediaInModal(mediaById, mediaSorted)
}

function sortBy(mediaById){
    
    const data = Object.values(mediaById)

    function byDate(){
        sortedData = data.sort((a,b)=>{ 
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        return sortedData.map(media=>media.id)
    }

    function byPopularity(){
        sortedData = data.sort( (a,b)=>{ 
            return a.likes - b.likes
        })
        return sortedData.map(media=>media.id)
    }

    function byTitle(){
        sortedData = data.sort( (a,b)=>{ 
            return a.title.localeCompare(b.title)
        })
        return sortedData.map(media=>media.id)
    }

    return {byDate, byPopularity, byTitle}
}

function displayTotalLike(mediaById){
    const photographerLikes = document.getElementById("photographerLikes")
    const total = Object.values(mediaById).reduce((sum,  {likes} ) => sum + likes, 0)
    photographerLikes.innerText = String(total)
}

async function addOnlyOneLike (mediaById){
    const addLike = document.querySelectorAll(".addLike")
    for(let cpt=0; cpt<addLike.length; cpt++){
        addLike[cpt].addEventListener("click",(event)=>{
            const mediaId = event.target.parentElement.parentElement.parentElement.id
            if (mediaById[mediaId].liked) {
                return
            }

            mediaById[mediaId].likes++
            mediaById[mediaId].liked=true

            event.target.parentElement.children[0].innerText = String(mediaById[mediaId].likes)

            displayTotalLike(mediaById)
        })
    }
}

const openModal = (mediaById, sortedIds, mediaId) => {
    const carouselModal = document.querySelector(".carouselLayout")
    const sortedMedias = sortedIds.map((id) => mediaById[id])
    const idSorted = sortedMedias.map(elt=>String(elt.id))
    const callbackFactory = factoryPattern(mediaById[mediaId])
    mediaInCarouselTemplate(callbackFactory)
    carouselModal.style.display="flex"

    const mediaInCarousel = document.querySelector(".dMM__mediaContents-img")

    const previousIcon = document.getElementById("previousMedia")
    const previousmedia = ()=>{
        const mediaId = mediaInCarousel.id
        let indexPreviousMedia = idSorted.indexOf(mediaId)-1
        if (indexPreviousMedia<0){
            indexPreviousMedia=idSorted.length-1
        }
        const idOfPreviousMedia = idSorted[indexPreviousMedia]
        const callbackFactory=factoryPattern(mediaById[idOfPreviousMedia])
        mediaInCarouselTemplate(callbackFactory)
    }
    previousIcon.addEventListener("click",previousmedia)

    const nextIcon = document.getElementById("nextMedia")
    const nextMedia = ()=>{
        // previousIcon.removeEventListener("click",previousmedia)
        const mediaId = mediaInCarousel.id
        let indexNextMedia = idSorted.indexOf(mediaId)+1
        if (indexNextMedia>idSorted.length-1){
            indexNextMedia=0
        }
        const idOfNextMedia = idSorted[indexNextMedia]
        const callbackFactory=factoryPattern(mediaById[idOfNextMedia])
        mediaInCarouselTemplate(callbackFactory)
    }
    nextIcon.addEventListener("click",nextMedia)

    const layout = document.querySelector(".displayMediaModal")
    layout.addEventListener("click",(event)=>{
        if(event.target.className === "displayMediaModal" || event.target.className === "dMM_controls-close"){
            closeCarouselModal()
            nextIcon.removeEventListener("click",nextMedia)
            previousIcon.removeEventListener("click",previousmedia)
        }
    })

 }

function displayMediaInModal (mediaById, mediaSorted) {
    const mediaToShow = document.querySelectorAll(".fS__mediaCard-img")
    for(let cpt=0; cpt<mediaToShow.length; cpt++){
        mediaToShow[cpt].addEventListener("click",(event)=>{
            openModal(mediaById, mediaSorted, event.target.parentElement.id)
        })
    }
}

function closeCarouselModal(){
    const carouselModal = document.querySelector(".carouselLayout")
    carouselModal.style.display="none"
}

async function init(){
    const photographers = await dataPhotographerApi()
    idKey=idRecover()
    
    const photographer = photographers.getPhotographerById(idKey)
    const photographerSection = document.querySelector(".photographHeader")
    displayProfil( photographer, photographerSection)
    
    const mediaPhotographer = photographers.getPhotographerMedia(idKey)
    
    const mediaById = mediaPhotographer.reduce((acc, media) => {
        media["liked"]=false
        acc[media.id] = media
        
        return acc
    }, {}) 
    
    dropbox(mediaById)
    displayTotalLike(mediaById)

    //Modal Contact
            const contactTitle = document.getElementById("contactPhotographer")
            contactTitle.innerText=photographer.name

            const layout = document.querySelector(".contact_modal")
            layout.addEventListener("click",(event)=>{
                event.target.className === "contact_modal" ? closeModal() : null
            })
            
            const contactForm = document.getElementById("contactForm")
            
            
            const form = document.querySelectorAll(".cF__input")
            form.forEach(elt=>{
                elt.value = ""
            })

            contactForm.addEventListener("submit",(event)=>{
                event.preventDefault()
                const formData = new ContactForm(form)
                const inputHandlers = formData.inputEntries
                console.log(inputHandlers)
                form.forEach(elt=>{
                    elt.value = ""
                })
            })
}

init()

