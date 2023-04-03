document.addEventListener('DOMContentLoaded', (event)=>{
    const createMonsterDiv = document.getElementById('create-monster')
    const monsterContainerDiv = document.getElementById('monster-container')
    const backButton = document.getElementById('back')
    backButton.disabled = true //Disable at start, since you start on first page
    const forwardButton = document.getElementById('forward')
    const monsterLib = []
    let pageArr = [], currentPage =1
    const monsterURL = 'http://localhost:3000/monsters'
    //Gather monster data from API
    fetch(monsterURL).then(resp => resp.json()).then(data => {
        let count = 0
        for (const newMonster of data) {
            pageArr.push(newMonster) //add monster to current page
            count++
            if (count === 50) { //at 50 monsters, stores each page as an array of monster objects
                monsterLib.push(pageArr)
                count =0
                pageArr = []
            }
        }
        if(count>0) monsterLib.push(pageArr) //creates the last page if there are remaining monsters
    }).then(displayMonsters)
    //display first set of monsters and establish function to display current page

    function displayMonsters(){
        while(monsterContainerDiv.hasChildNodes()) (monsterContainerDiv.removeChild(monsterContainerDiv.firstChild)) //removes current page's monsters
        //Monster object contains `${name}` as h2, `Age: ${age}` as h4, `Bio: ${description}` as p
        monsterLib[currentPage-1].forEach(monster => { //adds each monster on page to container
            const monsterName = document.createElement('h2')
            monsterName.innerHTML = monster.name
            const monsterAge = document.createElement('h4')
            monsterAge.innerHTML = `Age: ${monster.age}`
            const monsterDesc = document.createElement('p')
            monsterDesc.innerHTML = `Bio: ${monster.description}`
            monsterContainerDiv.append(monsterName, monsterAge, monsterDesc)
        })
    }
    //back button
    backButton.addEventListener('click', (event)=>{
        forwardButton.disabled = false //re-enables forward button if moving from last page
        currentPage--
        displayMonsters()
        if (currentPage ===1) backButton.disabled = true //disables button if on first page
    })
    //forward button
    forwardButton.addEventListener('click', (event) =>{
        backButton.disabled = false //re-enables back button if moving from page 1
        currentPage++
        displayMonsters()
        if (currentPage ===monsterLib.length) forwardButton.disabled = true //disables button if on last page
    })
    //Creates a form to add monsters
    const monsterForm = document.createElement('form')
    const nameInput = document.createElement('input')
    nameInput.setAttribute('id', 'name')
    nameInput.setAttribute('placeholder', 'enter name')
    const ageInput = document.createElement('input')
    ageInput.setAttribute('id', 'age')
    ageInput.setAttribute('placeholder', 'enter age')
    const descInput = document.createElement('input')
    descInput.setAttribute('id', 'description')
    descInput.setAttribute('placeholder', 'enter description')
    const createButton = document.createElement('button')
    createButton.innerHTML = 'create'
    createButton.addEventListener('click', (event) => {//Adds new monster to database & displays if necessary
        event.preventDefault()
        const newMonsterObj = {
            name: nameInput.value,
            age: ageInput.value,
            description: descInput.value
        }
        const postObj = {
            method: 'post',
            headers:    {      "Content-Type": "application/json",      Accept: "application/json"    },
            body:        JSON.stringify(newMonsterObj)
        }
        fetch(monsterURL, postObj).then(resp => resp.json()).then(newMonster => {
            debugger
            if(monsterLib[monsterLib.length-1].length<50) monsterLib[monsterLib.length-1].push(newMonster) //adds monster to the last page
            else{//if last page is full, add new page, ensure page is able to be navigated
                monsterLib.push([newMonster])
                forwardButton.disabled = false
             } 
            displayMonsters()
        })
    })
    monsterForm.append(nameInput, ageInput, descInput, createButton)
    createMonsterDiv.append(monsterForm)
})