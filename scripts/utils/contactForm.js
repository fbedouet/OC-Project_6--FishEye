function displayModal() {
    const modal = document.getElementById("contactLayout");
	modal.style.display = "block";
    inertedBackground().enable()
}

function closeModal() {
    const modal = document.getElementById("contactLayout");
    modal.style.display = "none";
    inertedBackground().disable()
}
