const cards = document.querySelectorAll('.card');
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let score = 0;
let matchesFound = 0;
let likes = 0;
let likeButtonDisabled = false;

function handleLikeButtonClick(player) {
    let likes = Cookies.get('likes') || 0 ;
    if (!likeButtonDisabled) {
        document.getElementById(`like-button-${player}`).classList.add("liked");
        likes++;
        document.getElementById("like-count").textContent = likes;
        likeButtonDisabled = true;
        alert('You just liked my game, holy hell, thats awesome my dude. Send many love to you guys')
    }
    Cookies.set('likes', likes);
    // const likeCount = document.querySelector('.like-count');
    likeCount.innerText = likes;
}

function resetLikeButton() {
    document.getElementById("like-button-1").classList.remove("liked");
    document.getElementById("like-button-2").classList.remove("liked");
    likes = 0;
    document.getElementById("like-count").textContent = likes;
    likeButtonDisabled = false;
}


function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    // Display the image
    const img = document.createElement('img');
    img.src = this.dataset.framework;
    this.innerHTML = '';
    this.appendChild(img);

    this.classList.add('selected');

    if (!hasFlippedCard) {
        // first click
        hasFlippedCard = true;
        firstCard = this;
    } else {
        // second click
        hasFlippedCard = false;
        secondCard = this;

        // Check for a match
        if (firstCard.dataset.framework === secondCard.dataset.framework) {
            // Cards match
            // firstCard.classList.add('match');
            // secondCard.classList.add('match');
            checkForMatch();
        } else {
            // Cards don't match
            lockBoard = true;
            setTimeout(() => {
                firstCard.innerHTML = '';
                secondCard.innerHTML = '';
                firstCard.classList.remove('selected');
                secondCard.classList.remove('selected');
                lockBoard = false;
            }, 1000);
        }
    }
}

function checkForMatch() {
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
        disableCards();
        score += 1;
        matchesFound += 1;
        document.getElementById('score').textContent = `Score: ${score}`;
        if (matchesFound === cards.length / 2) {
            setTimeout(() => {
                alert('Congratulations! You won!');
                resetGame();
            }, 1000);
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
    firstCard.isFlipped = false;
    secondCard.isFlipped = false;
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

cards.forEach(card => card.addEventListener('click', flipCard));

function resetGame() {
    score = 0;
    matchesFound = 0;
    cards.forEach(card => {
        card.classList.remove('selected', 'match');
        card.innerHTML = `<span class="back-face"></span><span class="front-face" style="background-image: url(${card.dataset.framework});"></span>`;
        card.classList.remove('flip');
    });
    setTimeout(() => {
        shuffleCards();
    }, 1000);

    shuffle();
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    resetBoard();
}

const resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', resetGame);
