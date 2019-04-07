// Create a list that holds all of your cards
let cardArray = [...document.getElementsByClassName("card")];
let openCards = [];

// Counters
let moves = 0;
let cardsMatched = 0;
let starsNumber = 3;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Show the shuffled cards on the html
function addDeckShuffled(array) {
	const fragment = document.createDocumentFragment();
    for(card of array){
        fragment.appendChild(card);
	}
    document.getElementById("deck").appendChild(fragment);
}

// Show card
function showCard(card){
    let classArray = card.classList;
    classArray.add("open");
    classArray.add("show");
}

// Hide card
function hideCard(card){
    let classArray = card.classList;
    classArray.remove("open");
    classArray.remove("show");
}

// Check is all the cards are matched
function isEndGame(){
    if(cardsMatched == 8) {
        document.getElementsByClassName("container").item(0).style.display = "none";

        let winMessage = `Win in ${moves} moves and ${starsNumber} stars.`;
        document.getElementById("victory-message").innerText = winMessage;
        document.getElementById("victory-modal").style.display = "block";
    }
}

// Managed if the cards are matched or not
function checkMatch(currentCard) {
    hideCard(openCards[0]);
    
    if(currentCard.firstElementChild.className == openCards[0].firstElementChild.className){
        // Match the cards
        currentCard.classList.add("match");
        openCards[0].classList.add("match");
        // Delete the events for both cards
        currentCard.removeEventListener('click', cardClicked);
        openCards[0].removeEventListener('click', cardClicked);
        cardsMatched++;
        isEndGame();
    } else {
        openCards[0].addEventListener('click', cardClicked);
    }
    openCards.pop()
}

// increment moves
function increaseMoves() {
    moves++;
    document.getElementById("moves").innerText = moves;
}

// Change star style
function changeStar(classArray) {
    classArray.remove("fa-star");
    classArray.add("fa-star-o");
}

// Start rating
function starsRating(){
    if(moves > 24) {
        starsNumber = 0;
        changeStar(document.getElementById("star-one").classList);
    } else if (moves > 16) {
        starsNumber = 1;
        changeStar(document.getElementById("star-two").classList);
    } else if (moves > 8) {
        starsNumber = 2;
        changeStar(document.getElementById("star-three").classList);
    }
}

// Control the logic behind the match of cards
function cardClicked () {
    if(openCards.length){
        increaseMoves();
        starsRating()
        checkMatch(this);
    } else {
        showCard(this);
        this.removeEventListener('click', cardClicked);
        openCards.push(this);
    }
}

// Create events listeners for the cards
function createEventsListeners(array) {
    for(card of array){        
        card.addEventListener('click', cardClicked);
    }
}

// Reset the game
function restart() {
    openCards = [];

    // Reset cards
    for(card of cardArray){
        if(card.classList.contains("open") && card.classList.contains("show")){
            card.classList.remove("open");
            card.classList.remove("show");
        } else if(card.classList.contains("match")) {
            card.classList.remove("match");
        }
    }

    //Reset stars
    let starsArray = document.getElementsByClassName("stars").item(0).children;
    for(star of starsArray){
        star.firstElementChild.classList.remove("fa-star-o");
        star.firstElementChild.classList.add("fa-star");
    }

    moves = 0;
    cardsMatched = 0;
    starsNumber = 3;
    document.getElementById("moves").innerText = moves;
    document.getElementsByClassName("container").item(0).style.display = "flex";
    managedGrid();
}

// Main function of the game
function managedGrid(){
    // Hide victory message
    document.getElementById("victory-modal").style.display = "none";

    // Shuffle the array and update the page
    cardArray = shuffle(cardArray);
 	addDeckShuffled(cardArray);

    // Add listeners to cards
    createEventsListeners(cardArray);

    // Add listeners to restart button
    document.getElementsByClassName("restart").item(0).addEventListener('click', function(){
        restart();
    });
}

managedGrid();