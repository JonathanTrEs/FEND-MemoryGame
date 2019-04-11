// Initialize background from https://marcbruederlin.github.io/particles.js/
window.onload = function() {
    Particles.init({
        selector: '.background',
    });
};

// Create a list that holds all of your cards
let cardArray = [...document.getElementsByClassName("card")];
let openCards = [];

// Counters
let moves = 0;
let cardsMatched = 0;
let starsNumber = 3;

// This array is for hide cards after a while
let failCards = [];

// Allow user click
let allowClick = true;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Fadeout function from https://stackoverflow.com/questions/29017379
function fadeOutEffect(fadeTarget) {
    var fadeEffect = setInterval(function() {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 200);
}

// Show the shuffled cards on the html
function addDeckShuffled(array) {
    const fragment = document.createDocumentFragment();
    for (card of array) {
        fragment.appendChild(card);
    }
    document.getElementById("deck").appendChild(fragment);
}

// Show card
function showCard(card) {
    let classArray = card.classList;
    classArray.add("open");
    classArray.add("show");
}

// Hide card
function hideCard(card) {
    let classArray = card.classList;
    classArray.remove("open");
    classArray.remove("show");
}

// Check is all the cards are matched
function isEndGame() {
    if (cardsMatched == 8) {
        document.getElementsByClassName("container").item(0).style.display = "none";

        let winMessage = `Win in ${moves} moves and ${starsNumber} stars.`;
        document.getElementById("victory-message").innerText = winMessage;
        document.getElementById("victory-modal").style.display = "block";
    }
}

function failAnimation() {
    for (card of failCards) {
        card.classList.remove("fail");
        hideCard(card);
    }
    failCards = [];
    allowClick = true;
}

// Managed if the cards are matched or not
function checkMatch(currentCard) {
    if (currentCard.firstElementChild.className == openCards[0].firstElementChild.className) {
        // Remove open and show from open card
        hideCard(openCards[0]);
        // Match the cards
        currentCard.classList.add("match");
        openCards[0].classList.add("match");

        // Win Animation
        currentCard.classList.add("bounce");
        openCards[0].classList.add("bounce");

        fadeOutEffect(currentCard);
        fadeOutEffect(openCards[0]);

        allowClick = false;
        setTimeout(function() {
            isEndGame();
            allowClick = true;
        }, 1500);

        // Delete the events for both cards
        currentCard.removeEventListener('click', cardClicked);
        openCards[0].removeEventListener('click', cardClicked);
        cardsMatched++;
    } else {
        // Fail animation
        showCard(currentCard);
        currentCard.classList.add("fail");
        openCards[0].classList.add("fail");

        failCards.push(currentCard);
        failCards.push(openCards[0]);
        allowClick = false;
        setTimeout(failAnimation, 1500);

        openCards[0].addEventListener('click', cardClicked);
    }
    openCards.pop()
}

// Increment moves
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
function starsRating() {
    if (moves > 20) {
        starsNumber = 0;
        changeStar(document.getElementById("star-one").classList);
    } else if (moves > 15) {
        starsNumber = 1;
        changeStar(document.getElementById("star-two").classList);
    } else if (moves > 10) {
        starsNumber = 2;
        changeStar(document.getElementById("star-three").classList);
    }
}

// Control the logic behind the match of cards
function cardClicked() {
    if (openCards.length) {
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
    for (card of array) {
        card.addEventListener('click', cardClicked);
    }
}

// Reset the game
function restart() {
    openCards = [];

    // Reset cards
    for (card of cardArray) {
        card.style.opacity = 1;
        if (card.classList.contains("open") && card.classList.contains("show")) {
            card.classList.remove("open");
            card.classList.remove("show");
        } else if (card.classList.contains("match") && card.classList.contains("bounce")) {
            card.classList.remove("match");
            card.classList.remove("bounce");
        }
    }

    //Reset stars
    let starsArray = document.getElementsByClassName("stars").item(0).children;
    for (star of starsArray) {
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
function managedGrid() {
    // Hide victory message
    document.getElementById("victory-modal").style.display = "none";

    // Shuffle the array and update the page
    cardArray = shuffle(cardArray);
    addDeckShuffled(cardArray);

    // Add listeners to cards
    createEventsListeners(cardArray);

    // Add listener to the body to control user click
    var body = document.getElementsByTagName("body").item(0);
    body.addEventListener('click', function(event) {
        if (!allowClick) {
            event.stopPropagation();
        }
    }, true);

    // Add listeners to restart button
    document.getElementsByClassName("restart").item(0).addEventListener('click', function() {
        restart();
    });
}

managedGrid();