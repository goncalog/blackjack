const initialCards = 2;
const houseMinScore = 17;
const cardBack = "./images/card-back.jpeg"
const dictCardValues = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "1": 10,
        "J": 10, "Q": 10, "K": 10, "A": 11, 
}

const messageP = $("#message");
const newGameButton = $("#new-game");
const hitButton = $("#hit");
const standButton = $("#stand");

let houseCardsElements;
let playerCardsElements;

let availableDeck = [];
let playerCards = [];
let houseCards = [];

let playerScore = 0;
let houseScore = 0;
let houseCanPlay = true;

newGameButton.on("click", e => {
    availableDeck = ["2C", "2D", "2H", "2S", "3C", "3D", "3H", "3S", "4C", "4D", "4H", "4S", 
            "5C", "5D", "5H", "5S", "6C", "6D", "6H", "6S", "7C", "7D", "7H", "7S", "8C", "8D", 
            "8H", "8S", "9C", "9D", "9H", "9S", "10C", "10D", "10H", "10S", "JC", "JD", "JH", "JS",
            "QC", "QD", "QH", "QS", "KC", "KD", "KH", "KS", "AC", "AD", "AH", "AS"];
    playerCards = [];
    houseCards = [];
    
    playerScore = 0;
    houseScore = 0;
    houseCanPlay = true;
    
    hitButton.css("visibility", "visible");
    standButton.css("visibility", "visible");
    messageP.css("visibility", "hidden");

    [houseCardsElements, playerCardsElements] = 
            restartImageElements([houseCardsElements, playerCardsElements]);

    [playerCards, houseCards] = getInitialCards();

    for(let i=0; i < initialCards; i++){
        showCard(getImageSrc(playerCards[i]), playerCardsElements[i]);

        if(i < 1){
            showCard(getImageSrc(houseCards[i]), houseCardsElements[i]);
        } else {
            showCard(cardBack, houseCardsElements[i]);
        }
    }

    playerScore = getCurrentScore(playerCards);
    checkBlackJack(playerScore, "player");
});

hitButton.on("click", e => {
    playerCards = addCard(playerCards);
    
    $("#player-cards").append('<img class="player-cards">');
    playerCardsElements = $(".player-cards");
    
    showCard(getImageSrc(playerCards[playerCards.length - 1]), 
            playerCardsElements[playerCards.length - 1]);
    
    playerScore = getCurrentScore(playerCards);

    checkBlackJack(playerScore, "player");
    checkBust(playerScore, "player");
});

standButton.on("click", e => {
    hitButton.css("visibility", "hidden");
    standButton.css("visibility", "hidden");
    
    showCard(getImageSrc(houseCards[houseCards.length - 1]), 
            houseCardsElements[houseCards.length - 1]);
    
    houseScore = getCurrentScore(houseCards);

    checkBlackJack(houseScore, "house");
    checkBust(houseScore, "house");

    if(houseCanPlay){
        houseCanPlay = checkHouseCanPlay(houseScore);

        if(!houseCanPlay){
            checkWinner(playerScore, houseScore);
        }
    }
    
    while(houseCanPlay){
        houseCards = addCard(houseCards);

        $("#house-cards").append('<img class="house-cards">');
        houseCardsElements = $(".house-cards");

        showCard(getImageSrc(houseCards[houseCards.length - 1]), 
                houseCardsElements[houseCards.length - 1]);
        
        houseScore = getCurrentScore(houseCards);
    
        checkBlackJack(houseScore, "house");
        checkBust(houseScore, "house");

        if(houseCanPlay){
            houseCanPlay = checkHouseCanPlay(houseScore);

            if(!houseCanPlay){
                checkWinner(playerScore, houseScore);
            }            
        }
    }
});

function checkBlackJack(scoreArray, identification){
    if(scoreArray.indexOf(21) >= 0){
        let messageString = "";
        switch(identification){
            case "player": 
                messageString = "WIN";
                break;

            case "house": 
                messageString = "LOSE";
                houseCanPlay = false;
                break;
        }

        messageP.text("BlackJack - You " + messageString + "!");
        messageP.css("visibility", "visible");
        hitButton.css("visibility", "hidden");
        standButton.css("visibility", "hidden");
    }
}

function checkBust(scoreArray, identification){
    let hasLostGame = scoreArray.reduce((lost, value) => {
        if(value <= 21){
            lost = false;
        }
        return lost;
    }, true);

    if(hasLostGame){
        let messageString = "";
        switch(identification){
            case "player": 
                messageString = "LOSE";
                break;

            case "house": 
                messageString = "WIN";
                houseCanPlay = false;
                break;
        }

        messageP.text("Busted - You " + messageString + "!");
        messageP.css("visibility", "visible");
        hitButton.css("visibility", "hidden");
        standButton.css("visibility", "hidden");    
    }
}

function checkHouseCanPlay(scoreArray){
    let canPlay = scoreArray.reduce((play, value) => {
        if(value >= houseMinScore && value < 21){
            play = false;
        }
        return play;
    }, true);

    return canPlay;
}

function checkWinner(playerScoreArray, houseScoreArray){
    let playerScore = playerScoreArray.reduce((score, value) => {
        if(value < 21 && value > score){
            score = value;
        }
        return score;
    }, 0);

    let houseScore = houseScoreArray.reduce((score, value) => {
        if(value < 21 && value > score){
            score = value;
        }
        return score;
    }, 0);

    let messageString = "";
    if(playerScore > houseScore){
        messageString = "You WIN";
    } else if(houseScore > playerScore){
        messageString = "You LOSE";
    } else {
        messageString = "It's a DRAW";
    }

    messageP.text(messageString + "!");
    messageP.css("visibility", "visible");
    hitButton.css("visibility", "hidden");
    standButton.css("visibility", "hidden");
}

function getInitialCards(){
    let playerArray = [];
    let houseArray = [];

    for(let i=0; i < initialCards; i++){
        let randomNumber = Math.floor(Math.random() * availableDeck.length);
        playerArray.push(availableDeck[randomNumber]);
        availableDeck.splice(randomNumber, 1);

        randomNumber = Math.floor(Math.random() * availableDeck.length);
        houseArray.push(availableDeck[randomNumber]);
        availableDeck.splice(randomNumber, 1);
    }

    return [playerArray, houseArray];
}

function addCard(cardsArray){
    let randomNumber = Math.floor(Math.random() * availableDeck.length);
    cardsArray.push(availableDeck[randomNumber]);
    availableDeck.splice(randomNumber, 1);

    return cardsArray;
}

function showCard(imageSrc, cardElement){
    $(cardElement).attr("src", imageSrc);
    $(cardElement).css("visibility", "visible");
}

function getCurrentScore(cardsArray){
    let cardValuesArray = cardsArray.map(card => {
        return dictCardValues[card[0]];
    });
    
    let cardValuesSum = cardValuesArray.reduce((sum, value) => {
        return sum + value;
    }, 0);

    let numAces = cardValuesArray.reduce((acesCount, value) => {
        if(value === 11){
            acesCount++;
        }
        return acesCount;
    }, 0);

    let score = [];
    if(numAces === 0){
        score.push(cardValuesSum);
    } else {
        score.push(cardValuesSum - 10 * numAces);
        score.push(cardValuesSum - 10 * (numAces - 1));
    }
    
    return score;
}

function getImageSrc(imageStr){
    return "./images/" + imageStr + ".png";
}

function restartImageElements(imageElementsArrays){
    let classArray = ["house-cards", "player-cards"];

    for(let i=0; i < imageElementsArrays.length; i++){
        imageElementsArrays[i] = $("." + classArray[i]);
        if(imageElementsArrays[i].length > 2){
            for(let j=2; j < imageElementsArrays[i].length; j++){
                document.getElementById(classArray[i]).children[2].remove();
            }
        }

        imageElementsArrays[i] = $("." + classArray[i]);
        imageElementsArrays[i].each(function() {
            let card = $(this);
            card.css("visibility", "hidden");
            card.attr("src", "");
        });
    }

    return imageElementsArrays;
}