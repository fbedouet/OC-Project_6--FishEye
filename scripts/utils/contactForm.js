function displayModal() {
    const modal = document.getElementById('contactLayout')
    const header = document.getElementById('header')
    const main = document.getElementById('main')
    const closeContact = document.querySelector('.closeContact')
    modal.ariaHidden = false
    header.ariaHidden = true
    main.ariaHidden = true
    modal.focus()
    inertBackgroundModal().enable()

    setTimeout(() => {
        console.log(closeContact.focus())
       }, 1000); 


    modal.querySelector('.focusable').addEventListener('keydown',(event)=>{
        if (event.key === 'Enter'){
            const contactBtn = document.querySelector('.contactButton')
            closeModal()
            // contactBtn.focus()
        }
    })
}

function closeModal() {
    const modal = document.getElementById('contactLayout')
    const header = document.getElementById('header')
    const main = document.getElementById('main')
    modal.ariaHidden = true
    header.ariaHidden = false
    main.ariaHidden = false
    inertBackgroundModal().disable()
}
