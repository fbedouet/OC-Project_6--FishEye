function photographerTemplate(data) {
    const { id, name, portrait, tagline, price, city, country } = data;
    const picture = `assets/photographers/Photographers_ID_Photos/${portrait}`;
    const url= "/photographer.html"

    function getUserCardDOM() {
        const article = document.createElement( 'article' );

        const img =`
                    <a href="/photographer.html?id=${id}" class="photographer">
                        <div class="profil">
                            <img src=${picture}>
                        </div>
                        <h2>${name}</h2>
                    </a>
                    <h3>${city}, ${country}</h3>
                    <p class="tagline">${tagline}</p>
                    <p class="price">${price}€/jour</p>
        `
        article.innerHTML = img;
        return (article);
    }
    return { name, picture, getUserCardDOM }
}