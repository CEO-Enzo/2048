document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid');
    const width = 4;
    let squares = [];
    let score = 0;

    // Créer la grille
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            let square = document.createElement('div');
            square.classList.add('tile');
            square.setAttribute('data-value', 0);
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        generate();
        generate();
    }

    createBoard();

    // Générer un nombre aléatoire
    function generate() {
        let randomNumber = Math.floor(Math.random() * squares.length);
        if (squares[randomNumber].getAttribute('data-value') == 0) {
            squares[randomNumber].setAttribute('data-value', 2);
            squares[randomNumber].innerHTML = 2;
            updateTileStyle(squares[randomNumber]);
            checkForGameOver();
        } else if (!isBoardFull()) {
            generate();
        }
    }

    function isBoardFull() {
        return squares.every(square => square.getAttribute('data-value') != 0);
    }

    // Mettre à jour le style de la tuile en fonction de sa valeur
    function updateTileStyle(tile) {
        let value = tile.getAttribute('data-value');
        tile.className = 'tile';
        tile.setAttribute('data-value', value);
        if (value > 0) {
            tile.innerHTML = value;
        } else {
            tile.innerHTML = '';
        }
    }

    // Fonction de mouvement
    function move(direction) {
        let hasMoved = false;

        for (let i = 0; i < width; i++) {
            let line = [];
            for (let j = 0; j < width; j++) {
                let index;
                if (direction === 'right' || direction === 'left') {
                    index = i * width + j;
                } else {
                    index = j * width + i;
                }
                let value = parseInt(squares[index].getAttribute('data-value'));
                line.push(value);
            }

            let originalLine = [...line];

            if (direction === 'right' || direction === 'down') {
                line = line.filter(num => num);
                let missing = width - line.length;
                let zeros = Array(missing).fill(0);
                line = zeros.concat(line);
            } else {
                line = line.filter(num => num);
                let missing = width - line.length;
                let zeros = Array(missing).fill(0);
                line = line.concat(zeros);
            }

            // Fusionner les nombres identiques
            for (let k = 0; k < width - 1; k++) {
                let index = direction === 'right' || direction === 'down' ? width - 1 - k : k;
                let nextIndex = index + (direction === 'right' || direction === 'down' ? -1 : 1);
                if (line[index] === line[nextIndex] && line[index] !== 0) {
                    line[index] *= 2;
                    line[nextIndex] = 0;
                    score += line[index];
                }
            }

            // Réaligner après fusion
            line = line.filter(num => num);
            let missing = width - line.length;
            let zeros = Array(missing).fill(0);
            if (direction === 'right' || direction === 'down') {
                line = zeros.concat(line);
            } else {
                line = line.concat(zeros);
            }

            // Mettre à jour les cases
            for (let j = 0; j < width; j++) {
                let index;
                if (direction === 'right' || direction === 'left') {
                    index = i * width + j;
                } else {
                    index = j * width + i;
                }
                if (squares[index].getAttribute('data-value') != line[j]) {
                    hasMoved = true;
                }
                squares[index].setAttribute('data-value', line[j]);
                updateTileStyle(squares[index]);
            }
        }

        if (hasMoved) {
            generate();
            checkForWin();
        }
    }

    // Assigner les touches du clavier
    function control(e) {
        switch (e.keyCode) {
            case 39:
                e.preventDefault();
                move('right');
                break;
            case 37:
                e.preventDefault();
                move('left');
                break;
            case 38:
                e.preventDefault();
                move('up');
                break;
            case 40:
                e.preventDefault();
                move('down');
                break;
        }
    }

    document.addEventListener('keydown', control);

    // Vérifier si le joueur a gagné
    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].getAttribute('data-value') == 2048) {
                alert('Félicitations, vous avez gagné !');
                document.removeEventListener('keydown', control);
                return;
            }
        }
    }

    // Vérifier si le joueur a perdu
    function checkForGameOver() {
        if (isBoardFull()) {
            for (let i = 0; i < squares.length; i++) {
                let value = parseInt(squares[i].getAttribute('data-value'));
                let right = i % width < width - 1 ? parseInt(squares[i + 1].getAttribute('data-value')) : null;
                let down = i + width < squares.length ? parseInt(squares[i + width].getAttribute('data-value')) : null;

                if (value === right || value === down) {
                    return;
                }
            }
            alert('Game Over !');
            document.removeEventListener('keydown', control);
        }
    }
});
