import {getDataPhotographerApi} from '../api/api.js'
import {photographerTemplate, cardFolioTemplate, mediaInCarouselTemplate} from '../templates/photographer.js'
import {displayModal,closeModal, inertBackgroundModal} from '../utils/contactForm.js'
import {FormatPicture, FormatMovie, ContactForm} from '../models/media.js'

function recoverIdFromPhotographer(){
    const urlStr=window.location.href
    const urlObj=new URL(urlStr)
    return Number(urlObj.search.split('=')[1])
}

function displayProfil(photographerData, htmlTag){
    const template = photographerTemplate(photographerData)
    htmlTag.innerHTML = template.profilPhotographerPage()
}

function displayPortfolio(mediaById, sortedIds){
    const sortedMedias = sortedIds.map((id) => mediaById[id])
    const photographerMain = document.getElementById('main')
    const folioSectionPresence = document.querySelector('.folioSection')
    if(folioSectionPresence){
        folioSectionPresence.remove()
    }
    const folioSection = document.createElement('section')
    folioSection.classList.add('folioSection')
 
    sortedMedias.forEach(elt => {
        const media=createMediaFactory(elt)
        const cardFolio= cardFolioTemplate(media)
        folioSection.appendChild(cardFolio)
    })
    photographerMain .appendChild(folioSection)
}

function createMediaFactory(mediaData){
    if(mediaData.image){
        const picture = new FormatPicture(mediaData)
        return picture 
    }
    if (mediaData.video){
        const movie = new FormatMovie(mediaData)
        return movie 
    }
}

function sortByDropdownMenu (mediaById){
    const dropdownButton = document.getElementById('dropDown__button')
    const dropdownMenuItems = document.querySelectorAll('#dropDown__menu a')
    const dropdownMenu = document.getElementById('dropDown__menu')

    //Open the menu by clicking on the button
    const openDropdownMenu = ()=>{
        dropdownMenu.ariaHidden=false
        dropdownMenuItems[0].focus()
    }
    dropdownButton.addEventListener('click',openDropdownMenu)

    //Close the menu
    const closeDropdownMenu =()=>{
        const dropdownMenu = document.getElementById('dropDown__menu')
        const dropdownButton = document.getElementById('dropDown__button')
        dropdownMenu.ariaHidden=true

        //Timer for focus acquisition by screen reader
        setTimeout(() => {
            dropdownButton.focus()
        }, 10)
    }

    //Close the menu by clicking outside the selection
    const closeWhenEscape = (event)=>{
        if (event.key==='Escape'){
            closeDropdownMenu()
            return
        }
        
    }
    document.addEventListener('keydown',closeWhenEscape)

    
    //Close the menu by clicking outside the selection
    const closeWhenClickedOutside = (event)=>{
        if (event.target.id==='dropDown__button'){
            return
        }
        closeDropdownMenu()
    }
    document.addEventListener('click',closeWhenClickedOutside)

    //display of selected sort
    const displaySelectedSort = (selectedItem)=>{
        const MEDIA_SORTED = sortBy(mediaById)
        let mediaSorted
        switch (selectedItem){
            case 'Titre':
                mediaSorted = MEDIA_SORTED.byTitle()
                break
            case 'Date':
                mediaSorted=MEDIA_SORTED.byDate()
                break
                
            case 'Popularité':
                mediaSorted=MEDIA_SORTED.byPopularity()
                break
        }
        displayPortfolio( mediaById, mediaSorted) 
        displayMediaInModal(mediaById, mediaSorted)
        addOnlyOneLike (mediaById)
    }

    const updateMenuItems = (event)=>{
        const selectedItem = event.target.innerText
        displaySelectedSort(selectedItem)
        event.target.innerText = dropdownButton.innerText
        event.target.ariaLabel = `Order bail ${dropdownButton.innerText}`
        dropdownButton.children[0].children[0].innerText=selectedItem
        dropdownButton.ariaLabel=`media sorted bail ${selectedItem}`
        dropdownMenu.children[0].children[0].innerText=selectedItem
        dropdownMenu.children[0].children[0].ariaLabel=`Order bail ${selectedItem}`
        closeDropdownMenu()
    }
    for (let cpt=0; cpt<dropdownMenuItems.length; cpt++){
        dropdownMenuItems[cpt].addEventListener('click',updateMenuItems)
    }
    //display first page access
    displaySelectedSort('Titre')
}

function sortBy(mediaById){
    
    const data = Object.values(mediaById)

    function byDate(){
        const sortedData = data.sort((a,b)=>{ 
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        return sortedData.map(media=>media.id)
    }

    function byPopularity(){
        const sortedData = data.sort( (a,b)=>{ 
            return a.likes - b.likes
        })
        return sortedData.map(media=>media.id)
    }

    function byTitle(){
        const sortedData = data.sort( (a,b)=>{ 
            return a.title.localeCompare(b.title)
        })
        return sortedData.map(media=>media.id)
    }

    return {byDate, byPopularity, byTitle}
}

function displayTotalLike(mediaById){
    const photographerLikes = document.getElementById('photographerLikes')
    const total = Object.values(mediaById).reduce((sum,  {likes} ) => sum + likes, 0)
    photographerLikes.innerText = String(total)
}

function addOnlyOneLike (mediaById){
    const addLike = document.querySelectorAll('.addLike')
    const likeIt = (event)=>{
        
        const mediaId = event.target.parentElement.parentElement.parentElement.id
        const likeTest = mediaById[mediaId].liked||Boolean(event.key !== undefined && event.key !== 'Enter')
        if (likeTest) {
            return
        }

        mediaById[mediaId].likes++
        mediaById[mediaId].liked=true
        event.target.parentElement.children[0].innerText = String(mediaById[mediaId].likes)
        event.target.ariaLabel=`${mediaById[mediaId].likes} like, like added`
        
        displayTotalLike(mediaById)
    }

    for(let cpt=0; cpt<addLike.length; cpt++){
        addLike[cpt].addEventListener('click',likeIt)
        addLike[cpt].addEventListener('keydown',likeIt)
    }

}

const openCarouselModal = (mediaById, sortedIds, mediaId) => {
    //Display carousel with media selected
    const header = document.getElementById('header')
    const main = document.getElementById('main')
    const carousel = document.getElementById('dMM__carousel')
    const carouselModal = document.querySelector('.carouselLayout')
    const sortedMedias = sortedIds.map((id) => mediaById[id])
    const idSorted = sortedMedias.map(elt=>String(elt.id))
    const callbackFactory = createMediaFactory(mediaById[mediaId])
    mediaInCarouselTemplate(callbackFactory)
    main.ariaHidden = true
    header.ariaHidden = true
    carouselModal.ariaHidden = false
    carouselModal.style.display='flex'
    carouselModal.focus()
    trapFocus(carousel)

    //Navigation in the carousel:
    const mediaInCarousel = document.querySelector('.dMM__mediaContents-img')

    //with previous arrow icon
    const previousIcon = document.getElementById('previousMedia')
    const showPreviousmedia = ()=>{
        const mediaId = mediaInCarousel.id
        let indexPreviousMedia = idSorted.indexOf(mediaId)-1
        if (indexPreviousMedia<0){
            indexPreviousMedia=idSorted.length-1
        }
        const idOfPreviousMedia = idSorted[indexPreviousMedia]
        const callbackFactory=createMediaFactory(mediaById[idOfPreviousMedia])
        mediaInCarouselTemplate(callbackFactory)
        carouselModal.focus()
        trapFocus(carousel)
    }
    previousIcon.addEventListener('click',showPreviousmedia)

    //with next arrow icon
    const nextIcon = document.getElementById('nextMedia')
    const showNextMedia = ()=>{
        const mediaId = mediaInCarousel.id
        let indexNextMedia = idSorted.indexOf(mediaId)+1
        if (indexNextMedia>idSorted.length-1){
            indexNextMedia=0
        }
        const idOfNextMedia = idSorted[indexNextMedia]
        const callbackFactory=createMediaFactory(mediaById[idOfNextMedia])
        mediaInCarouselTemplate(callbackFactory)
        carouselModal.focus()
        trapFocus(carousel)
    }
    nextIcon.addEventListener('click',showNextMedia) //nextMedia

    //close carousel management
    const layout = document.querySelector('.displayMediaModal')
    const closeModal = (event)=>{
        if(event.target.className === 'displayMediaModal' 
                    || event.target.parentElement.classList[0] === 'dMM_controls-close' 
                    || event.target.classList[0]==='dMM_controls-close'
                    || event.key==='Escape'){
            closeCarouselModal()
            nextIcon.removeEventListener('click',showNextMedia)
            previousIcon.removeEventListener('click',showPreviousmedia)
            document.removeEventListener('keydown',manageKeysPresses)
        }
    }
    layout.addEventListener('click',closeModal)
    
    //keyboard navigation management
    const modalId = document.getElementById('dMM__carousel')
    const focusable = modalId.querySelectorAll('.focusable')
    const manageKeysPresses = (event)=>{
        if (event.key==='Enter'){
            switch (document.activeElement){
                case focusable[0]:
                    showPreviousmedia()
                    break
                case focusable[2]:
                    closeModal(event)
                    break
                case focusable[3]:
                    showNextMedia()
                    break
            }
        }
        if (event.key==='ArrowLeft'){
            showPreviousmedia()
            return
        }
        if (event.key==='ArrowRight'){
            showNextMedia()
            return
        }
        if (event.key==='Escape'){
            closeModal(event)
            return
        }
    }
    document.addEventListener('keydown',manageKeysPresses)
    
    inertBackgroundModal().enable()
}

function displayMediaInModal (mediaById, mediaSorted) {
    const mediaToShow = document.querySelectorAll('.fS__mediaCard-img')

    for(let cpt=0; cpt<mediaToShow.length; cpt++){
        mediaToShow[cpt].addEventListener('click',(event)=>{
            openCarouselModal(mediaById, mediaSorted, event.target.parentElement.id)
        })
    }

    for (let cpt=0; cpt <mediaToShow.length;cpt++){
        mediaToShow[cpt].addEventListener('keydown',(event)=>{
            if(event.key==='Enter'){
                openCarouselModal(mediaById, mediaSorted, event.target.parentElement.id)
            } 
        })                      
    }
}

function closeCarouselModal(){
    const carouselModal = document.querySelector('.carouselLayout')
    const header = document.getElementById('header')
    const main = document.getElementById('main')
    carouselModal.style.display='none'
    inertBackgroundModal().disable()
    main.ariaHidden = false
    header.ariaHidden = false
    carouselModal.ariaHidden = true
}

function displayContactModal(photographerName){
    const contactTitle = document.getElementById('contactPhotographer')
    const contactButton = document.querySelector('.contactButton')
    const closeContact = document.querySelector('.closeContact')
    contactTitle.innerText = photographerName

    contactButton.addEventListener('click',displayModal)
    closeContact.addEventListener('click', closeModal)

    const layout = document.querySelector('.contact_modal')
    layout.addEventListener('click',(event)=>{
        event.target.className === 'contact_modal' ? closeModal() : null
    })

    document.addEventListener('keydown',(event)=>{
        if(event.key==='Escape'){
            closeModal()
        }
    })
            
    const contactForm = document.getElementById('contactForm')
            
            
    const form = document.querySelectorAll('.cF__input')
    form.forEach(elt=>{
        elt.value = ''
    })

    contactForm.addEventListener('submit',(event)=>{
        event.preventDefault()
        const formData = new ContactForm(form)
        console.log(formData.inputEntries)
        form.forEach(elt=>{
            elt.value = ''
        })
        closeModal()
    })
}

const trapFocus = (domElt) => {
    const focusableElts = domElt.querySelectorAll('input, button, .focusable')
    const focusableEltsSorted=Object.values(focusableElts).sort((a,b)=>{
        return a.tabIndex - b.tabIndex
    })
    const firstFocusableElt = focusableEltsSorted[0]
    const lastFocusableElt =  focusableEltsSorted[focusableEltsSorted .length-1]

        

    const trapFocusHandler = (event) => {
        if (event.key === 'Tab'){
            if(document.activeElement === lastFocusableElt && !event.shiftKey){
                firstFocusableElt.focus()
                event.preventDefault()
            }
            if(document.activeElement === firstFocusableElt && event.shiftKey){
                lastFocusableElt.focus()
                event.preventDefault()
            }
        }
    }
    domElt.addEventListener('keydown', trapFocusHandler)  
}

async function init(){ 
    const photographers = await getDataPhotographerApi()
    const idKey=recoverIdFromPhotographer()
    
    const photographer = photographers.getPhotographerById(idKey)
    const photographerSection = document.querySelector('.photographHeader')
    displayProfil( photographer, photographerSection)
    
    const mediaPhotographer = photographers.getPhotographerMedia(idKey)

    const mediaById = mediaPhotographer.reduce((acc, media) => {
        media['liked']=false
        acc[media.id] = media
        
        return acc
    }, {}) 
    
    sortByDropdownMenu(mediaById)
    displayTotalLike(mediaById)
    displayContactModal(photographer.name)
    // trapFocus(document.getElementById('dMM__carousel'))
    trapFocus(document.getElementById('contactLayout'))
    trapFocus(document.getElementById('dropDown__menu'))
}

init()

