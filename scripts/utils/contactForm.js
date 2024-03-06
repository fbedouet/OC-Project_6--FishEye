function displayModal() {
    const modal = document.getElementById("contactLayout");
	modal.style.display = "block";
    inertBackgroundModal().enable()

    modal.querySelector(".focusable").addEventListener("keydown",(event)=>{
        if (event.key === "Enter"){
            closeModal()
        }
    })
}

function closeModal() {
    const modal = document.getElementById("contactLayout");
    modal.style.display = "none";
    inertBackgroundModal().disable()
}
