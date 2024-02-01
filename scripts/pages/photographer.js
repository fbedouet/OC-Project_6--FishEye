function idRecover(){
    const urlStr=window.location.href
    const urlObj=new URL(urlStr)
    return urlObj.search.split("=")[1]
}

async function displayProfil(photographerData, htmlTag){
    const template = photographerTemplate(photographerData)
   htmlTag.innerHTML = template.profilPhotographerPage()
}


function factoryPattern(mediaData, htmlTag){
    const pictureId = mediaData
                        .filter((elt) => elt.image)
                        .map((elt) => elt.id)

    const movieId = mediaData
                        .filter((elt) => elt.video)
                        .map((elt) => elt.id)

    mediaData.forEach((elt) => {
        if(pictureId.find((idElt) => idElt === elt.id)){
            const picture = new formatPicture(elt)
            const CardDOM = cardMediaTemplate(picture)
            htmlTag.appendChild(CardDOM)
            return
        }
        if(movieId.find((idElt) => idElt === elt.id)){
            const movie = new formatMovie(elt)
            const CardDOM = cardMediaTemplate(movie)
            htmlTag.appendChild(CardDOM)
            return
        }
    })
    return htmlTag
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

async function init(){
    idKey=idRecover()
    dropbox()
    
    const photographers = await dataPhotographerApi()
    
    const photographer = photographers.getPhotographerById(idKey)
    const photographerSection = document.querySelector(".photograph-header")
    displayProfil( photographer, photographerSection)

    const mediaPhotographer = photographers.getPhotographerMedia(idKey)

    const emptyFolioSection = document.createElement("section")
    emptyFolioSection.classList.add("folio-section")
    const  filledFolioSection = factoryPattern(mediaPhotographer, emptyFolioSection)

    const photographerMain = document.getElementById("main")
    photographerMain.appendChild(filledFolioSection)
}

init()