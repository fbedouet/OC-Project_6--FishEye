    async function getPhotographers() {
        const photographers = await fetch("/data/photographers.json")
        return await photographers.json()
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");
        const photographersData = photographers.photographers
        photographersData.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        // Récupère les datas des photographes
        const  photographers  = await getPhotographers();
        displayData(photographers);
    }
    
    init();
    
