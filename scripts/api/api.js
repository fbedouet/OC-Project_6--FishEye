async function dataPhotographerApi() {
    let dataJSON = await fetch("/data/photographers.json")
    dataJSON =  await dataJSON.json()

    function getAllId(){
        const result = dataJSON.photographers.map(elt => elt.id)
        return result
    }

    function getPhotographerById(idKey){
        const result = dataJSON.photographers.filter(elt => elt.id == idKey)
        return result[0]
    }

    function getPhotographerMedia(IdKey){
        const result = dataJSON.media.filter(elt => elt.photographerId == IdKey)
        return result
    }

    return {getAllId, getPhotographerById, getPhotographerMedia }
}

export {dataPhotographerApi}