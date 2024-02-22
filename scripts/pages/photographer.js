function idRecover(){
    const urlStr=window.location.href
    const urlObj=new URL(urlStr)
    return urlObj.search.split("=")[1]
}

async function displayProfil(photographerData, htmlTag){
    const template = photographerTemplate(photographerData)
    htmlTag.innerHTML = template.profilPhotographerPage()
}

function displayPortfolio(mediaById){
    const photographerMain = document.getElementById("main")
    const folioSectionPresence = document.querySelector(".folioSection")
    if(folioSectionPresence){
        folioSectionPresence.remove()
    }
    const folioSection = document.createElement("section")
    folioSection.classList.add("folioSection")
 
    mediaById.forEach(elt => {
        const callbackFactory=factoryPattern(elt)
        const cardFolio= cardFolioTemplate(callbackFactory)
        folioSection.appendChild(cardFolio)
    });
    photographerMain .appendChild(folioSection)
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

const openModal = (mediaById, sortedIds, mediaId) => {
    const sortedMedias = sortedIds.map((id) => mediaById[id])

    // Fonction qui ouvre la modale en affichant l'élément courant (mediaId) et qui attache les listeners sur les flèches pour naviguer dans la modale
}

function dropbox(mediaById){
    const mediaInCarousel = document.querySelector(".dMM__mediaContents-img")
    
    const dropbox = document.querySelectorAll('#dropbox a')
    const splitter = document.querySelectorAll('#dropbox div')

    const MEDIA_SORTED = sortBy(mediaById)

    const previousIcon = document.getElementById("previousMedia")
    const nextIcon = document.getElementById("nextMedia")
    let mediaSorted
    let idSorted
    
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
                idSorted = mediaSorted.map(elt=>String(elt.id))
                displayPortfolio( mediaSorted) 
                displayMediaInModal(mediaById)
                addOnlyOneLike (mediaById)
                return
            }
        })
    }
    mediaSorted = MEDIA_SORTED.byTitle()
    idSorted = mediaSorted.map(elt=>String(elt.id))
    displayPortfolio(mediaSorted )
    displayMediaInModal(mediaById)

    const layout = document.querySelector(".displayMediaModal")
    layout.addEventListener("click",(event)=>{
        event.target.className === "displayMediaModal" ? closeCarouselModal() : null
    })

    previousIcon.addEventListener("click",()=>{
        const mediaId = mediaInCarousel.id
        let indexPreviousMedia = idSorted.indexOf(mediaId)-1
        if (indexPreviousMedia<0){
            indexPreviousMedia=idSorted.length-1
        }
        const idOfPreviousMedia = idSorted[indexPreviousMedia]
        const callbackFactory=factoryPattern(mediaById[idOfPreviousMedia])
        mediaInCarouselTemplate(callbackFactory)
    })

    nextIcon.addEventListener("click",()=>{
        const mediaId = mediaInCarousel.id
        let indexNextMedia = idSorted.indexOf(mediaId)+1
        if (indexNextMedia>idSorted.length-1){
            indexNextMedia=0
        }
        const idOfNextMedia = idSorted[indexNextMedia]
        const callbackFactory=factoryPattern(mediaById[idOfNextMedia])
        mediaInCarouselTemplate(callbackFactory)
    })
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

function displayMediaInModal (mediaById) {
    const mediaToShow = document.querySelectorAll(".fS__mediaCard-img")
    const carouselModal = document.querySelector(".carouselLayout")
    
    for(let cpt=0; cpt<mediaToShow.length; cpt++){
        mediaToShow[cpt].addEventListener("click",(event)=>{
            // openModal(mediaById, sortedIds, event.target.parentElement.id)






            const mediaId = event.target.parentElement.id
            const callbackFactory = factoryPattern(mediaById[mediaId])
            mediaInCarouselTemplate(callbackFactory)
            carouselModal.style.display="flex"
        })
    }
}

function closeCarouselModal(){
    const carouselModal = document.querySelector(".carouselLayout")
    carouselModal.style.display="none"
}

function sortBy(mediaById){
    
    const data = Object.values(mediaById)

    function byDate(){
        data.sort((a,b)=>{ 
            return new Date(a.date).getTime() - new Date(b.date).getTime()
            // return a.date.localeCompare(b.date)
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
        media["liked"]=false
        acc[media.id] = media
        
        return acc
    }, {}) 
    
    dropbox(mediaById)
    displayTotalLike(mediaById)
    addOnlyOneLike (mediaById)

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

