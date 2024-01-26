    async function getPhotographers() {
        const dataJSON = await fetch("/data/photographers.json")
        return await dataJSON.json()
    }

    async function displayData(data) {
        const photographersSection = document.querySelector(".photographer_section");
        data.photographers.forEach((photographer) => {
            const photographerCard = photographerTemplate(photographer);
            const userCardDOM = photographerCard.getPhotographer();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        // Récupère les datas des photographes
        const  dataJson  = await getPhotographers();
        displayData(dataJson);
    }
    
    init();