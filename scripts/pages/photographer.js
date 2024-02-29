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

function dropdownChange (mediaById){
    const dropdownButton = document.getElementById("dropDown__button")
    const dropdownMenuItems = document.querySelectorAll("#dropDown__menu a")
    const dropdownMenu = document.getElementById('dropDown__menu')
         

    const asInerted = (show)=>{
        const photographHeader = document.querySelector(".photographHeader")
        const folioSection = document.querySelector(".folioSection")
        const linkHeader = document.querySelector("header")
        photographHeader.inert=show
        folioSection.inert=show
        linkHeader.inert=show
    }
    //Close the menu by clicking on the button
    const dropdownCloseMenu =()=>{
        dropdownMenu.style.display="none"
        dropdownButton.children[0].children[1].className="fa-solid fa-chevron-down"
        asInerted(false)
        dropdownButton.focus()
    }               
    //Open the menu by clicking on the button
    const dropdownDisplayMenu = ()=>{
        if (dropdownMenu.style.display==="block"){
            dropdownCloseMenu()
            return
        }
        dropdownMenu.style.display="block"
        dropdownButton.children[0].children[1].className="fa-solid fa-chevron-up"
        asInerted(true)
        dropdownMenuItems[0].focus()
    }
    dropdownButton.addEventListener("click",dropdownDisplayMenu)
    
    //display of selected sort
    const displayFolio = (choose)=>{
        const MEDIA_SORTED = sortBy(mediaById)
        let mediaSorted
        switch (choose){
            case "Titre":
                mediaSorted = MEDIA_SORTED.byTitle()
                break
            case "Date":
                mediaSorted=MEDIA_SORTED.byDate()
                break
                
            case "Popularité":
                mediaSorted=MEDIA_SORTED.byPopularity()
                break
        }
        displayPortfolio( mediaById, mediaSorted) 
        displayMediaInModal(mediaById, mediaSorted)
        addOnlyOneLike (mediaById)
    }

    const dropdownMenuHandler = (event)=>{
        const chooseItems = event.target.innerText
        displayFolio(chooseItems)
        event.target.innerText = dropdownButton.innerText
        dropdownButton.children[0].children[0].innerText=chooseItems
        dropdownCloseMenu()
    }

    for (let cpt=0; cpt<dropdownMenuItems.length; cpt++){
        dropdownMenuItems[cpt].addEventListener("click",dropdownMenuHandler)
    }
    //display first page access
    displayFolio("Titre")
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
    const likeIt = (event)=>{
        const mediaId = event.target.parentElement.parentElement.parentElement.id
        const likeTest = mediaById[mediaId].liked||Boolean(event.key !== undefined && event.key !== 'Enter')
        if (likeTest) {
            return
        }

        mediaById[mediaId].likes++
        mediaById[mediaId].liked=true

        event.target.parentElement.children[0].innerText = String(mediaById[mediaId].likes)

        displayTotalLike(mediaById)
    }

    for(let cpt=0; cpt<addLike.length; cpt++){
        addLike[cpt].addEventListener("click",likeIt)
        addLike[cpt].addEventListener("keydown",likeIt)
    }

}

const inertedBackground = ()=>{
    const main =document.querySelector("main")
    const header =document.querySelector("header")

    const enable=()=>{
        main.inert=true
        header.inert=true
    }

    const disable = ()=>{
        main.inert=false
        header.inert=false
    }
    return {enable, disable}
}

const openModal = (mediaById, sortedIds, mediaId) => {
    //Display carousel with media selected
    const carouselModal = document.querySelector(".carouselLayout")
    const sortedMedias = sortedIds.map((id) => mediaById[id])
    const idSorted = sortedMedias.map(elt=>String(elt.id))
    const callbackFactory = factoryPattern(mediaById[mediaId])
    mediaInCarouselTemplate(callbackFactory)
    carouselModal.style.display="flex"

    //Navigation in the carousel:
    const mediaInCarousel = document.querySelector(".dMM__mediaContents-img")

        //with previous arrow icon
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

        //with next arrow icon
    const nextIcon = document.getElementById("nextMedia")
    const nextMedia = ()=>{
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

    //close carousel management
    const layout = document.querySelector(".displayMediaModal")
    const closeModal = (event)=>{
        if(event.target.className === "displayMediaModal" || event.target.className === "dMM_controls-close" || event.key==="Escape"){
            closeCarouselModal()
            nextIcon.removeEventListener("click",nextMedia)
            previousIcon.removeEventListener("click",previousmedia)
            document.removeEventListener('keydown',keypressedHandler)
        }
    }
    layout.addEventListener("click",closeModal)
    
    //keyboard navigation management
    const keypressedHandler = (event)=>{
        switch (event.key){
            case 'ArrowLeft':
                previousmedia()
                break
            case 'ArrowRight':
                nextMedia()
                break
            case 'Escape':
                closeModal(event)
                break
            case 'Enter':
                playVideo(event)
                break
            default:
                return
        }
    }
    document.addEventListener('keydown',keypressedHandler)
    inertedBackground().enable()
}

function displayMediaInModal (mediaById, mediaSorted) {
    const mediaToShow = document.querySelectorAll(".fS__mediaCard-img")
    const imgToShow = document.querySelectorAll(".fS__mediaCard-img")

    for(let cpt=0; cpt<mediaToShow.length; cpt++){
        mediaToShow[cpt].addEventListener("click",(event)=>{
            openModal(mediaById, mediaSorted, event.target.parentElement.id)
        })
    }

    for (let cpt=0; cpt <imgToShow.length;cpt++){
        imgToShow[cpt].addEventListener("keydown",(event)=>{
            console.log(event.key)
            if(event.key==='Enter'){
                openModal(mediaById, mediaSorted, event.target.parentElement.id)
            } 
        })                      
    }
}

function closeCarouselModal(){
    const carouselModal = document.querySelector(".carouselLayout")
    carouselModal.style.display="none"
    inertedBackground().disable()
}

function displayContactModal(photographerName){
    const contactTitle = document.getElementById("contactPhotographer")

    contactTitle.innerText = photographerName

    const layout = document.querySelector(".contact_modal")
    layout.addEventListener("click",(event)=>{
        event.target.className === "contact_modal" ? closeModal() : null
    })

    document.addEventListener('keydown',(event)=>{
        if(event.key==='Escape'){
            closeModal()
        }
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
        closeModal()
    })
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
    
    dropdownChange(mediaById)
    displayTotalLike(mediaById)
    displayContactModal(photographer.name)
}

init()

