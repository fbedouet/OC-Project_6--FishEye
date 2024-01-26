function idRecover(){
    const urlStr=window.location.href
    const urlObj=new URL(urlStr)
    return urlObj.search.split("=")[1]
}

async function getPhotographers() {
    let photographers = await fetch("/data/photographers.json")
    return await photographers.json()
}

async function init(){
    const mainPhotographerDom = document.getElementById("main")
    const data = await getPhotographers()
    const photographers = photographerTemplate(data)
    const userCardDOM= photographers.getPhotographerById(idRecover())
    mainPhotographerDom.appendChild(userCardDOM)
}

init()