document.addEventListener('DOMContentLoaded', (event)=>{
    const createMonsterDiv = document.getElementById('create-monster')
    const monsterContainerDiv = document.getElementById('monster-container')
    const backButton = document.getElementById('back')
    backButton.disabled = true //Disables at start, since you start on first page
    const forwardButton = document.getElementById('forward')
    const monsterArr = []
    let pageArr = [], currentPage =1
    const monsterURL = 'http://localhost:3000/monsters'
    fetch(monsterURL).then(resp => resp.json()).then(data => {
        let count = 0
        for (const newMonster of data) {
            pageArr.push(newMonster) //add monster to current page
            count++
            if (count === 50) { //at 50 monsters, stores each page as an array of monster objects
                monsterArr.push(pageArr)
                count =0
                pageArr = []
            }
        }
        if(count>0) monsterArr.push(pageArr) //creates the last page if there are remaining monsters
        console.log(monsterArr.length)
    }).then(displayMonsters)
    //display first set of monsters and establish function to display current page

    function displayMonsters(){
        while(monsterContainerDiv.hasChildNodes()) (monsterContainerDiv.removeChild(monsterContainerDiv.firstChild)) //removes current page's monsters
        //Monster object contains `${name}` as h2, `Age: ${age}` as h4, `Bio: ${description}` as p
        monsterArr[currentPage-1].forEach(monster => { //adds each monster on page to container
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
        if (currentPage ===monsterArr.length) forwardButton.disabled = true //disables button if on last page
    })
    /* ---- POST EXAMPLE ----
    POST http://localhost:3000/monsters
    headers:    {      "Content-Type": "application/json",      Accept: "application/json"    }
    body:        { name: string, age: number, description: string }
    */
})

/*
notes to self:
adding a 51st monster to a page, re-enable next page
adding monster to current (last) page, make sure it displays
*/