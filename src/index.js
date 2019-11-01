import Game from './Game'
import Canvas from './Canvas';
import restrictions from './restrictions'


const canvas = new Canvas(document.getElementById('canvas'));
const game = new Game(canvas, restrictions);
game.initPoints();
game.drawPoints();


document.getElementById('form-start').addEventListener('submit', (e) => {
    e.preventDefault();
    let config = new Map(new FormData(e.target));

    game.start(config);
});

document.getElementById('form-stop').addEventListener('submit', (e) => {
    e.preventDefault();
    game.stop();
})

const select = document.getElementById('restrictions');
restrictions.forEach((r, i) => {
    let option = document.createElement('option');
    option.value = i;
    option.innerText = r.description
    select.appendChild(option);
});