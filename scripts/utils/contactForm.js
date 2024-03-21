const inertBackgroundModal = ()=>{
    const main =document.querySelector('main')
    const header =document.querySelector('header')

    const enable=()=>{
        main.inert=true
        header.inert=true
    }

    const disable = ()=>{
        main.inert=false
        header.inert=false
    }
    return {enable, disable}
}

function displayModal() {
    const modal = document.getElementById('contactLayout')
    const header = document.getElementById('header')
    const main = document.getElementById('main')
    const fristnameInput = document.getElementById('firstName')
    modal.ariaHidden = false
    header.ariaHidden = true
    main.ariaHidden = true
    modal.focus()
    inertBackgroundModal().enable()

    setTimeout(() => {
        fristnameInput.focus()
    }, 100)


    modal.querySelector('.focusable').addEventListener('keydown',(event)=>{
        if (event.key === 'Enter'){
            closeModal()
        }
    })
}

function closeModal() {
    const modal = document.getElementById('contactLayout')
    const header = document.getElementById('header')
    const main = document.getElementById('main')
    const contactButton = document.querySelector('.contactButton')
    modal.ariaHidden = true
    header.ariaHidden = false
    main.ariaHidden = false
    inertBackgroundModal().disable()
    setTimeout(() => {
        contactButton.focus()
    }, 100)
}

export {displayModal, closeModal, inertBackgroundModal}
