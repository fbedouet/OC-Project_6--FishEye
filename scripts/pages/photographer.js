function idRecover(){
    const urlStr=window.location.href
    const urlObj=new URL(urlStr)
    return urlObj.search.split("=")[1]
}

async function displayProfil(photographerData, htmlTag){
    const template = photographerTemplate(photographerData)
    htmlTag.innerHTML = template.profilPhotographerPage()
}

function displayPortfolio(photographerData, htmlTag){
    const folioSection = document.createElement("section")
    folioSection.classList.add("folioSection")
    photographerData.forEach(elt => {
        const callbackFactory=factoryPattern(elt)
        const cardFolio= cardFolioTemplate(callbackFactory)
        folioSection.appendChild(cardFolio)
    });
    htmlTag.appendChild(folioSection)
    return folioSection
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

function dropbox(){
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
            console.log(outchoose)
            return
        }
    })
}
}

function displayTotalLike(mediaData){
    const photographerLikes = document.getElementById("photographerLikes")
    const likes = mediaData.map(like=>like.likes)
    let total = 0
    likes.forEach(elt => {
        total = total + elt
    });
    photographerLikes.innerText = String(total)
}

async function addOneLike (mediaData){
    const addLike = document.querySelectorAll(".addLike")
    for(let cpt=0; cpt<addLike.length; cpt++){
        addLike[cpt].addEventListener("click",(event)=>{
            let likeCounter = Number(event.target.parentElement.children[0].innerText)
            likeCounter++
            event.target.parentElement.children[0].innerText=String(likeCounter)
            mediaId = event.target.parentElement.parentElement.parentElement.id
            let cpt=mediaData.length
            while (cpt>0) {
                if( String( mediaData[cpt-1].id ) === mediaId ){
                    mediaData[cpt-1].likes = likeCounter
                }
                cpt--
            }
            displayTotalLike(mediaData)
        })
    }
}

async function init(){
    const photographers = await dataPhotographerApi()
    idKey=idRecover()
    
    const photographer = photographers.getPhotographerById(idKey)
    const photographerSection = document.querySelector(".photographHeader")
    displayProfil( photographer, photographerSection)
    
    const mediaPhotographer = photographers.getPhotographerMedia(idKey)
    const photographerMain = document.getElementById("main")
    displayPortfolio( mediaPhotographer, photographerMain)   

    displayTotalLike(mediaPhotographer)
    addOneLike(mediaPhotographer)
    
    dropbox()
}

init()
