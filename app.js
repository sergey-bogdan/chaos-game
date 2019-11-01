
// Restrictions return true if current vertex passes the restriction
const restrictions = [
    {
        do: (vertex, vertexes) => vertex.id === vertexes[vertexes.length - 1].id ? false : true,
        description: 'Current vertex cannot be same as previous one'
    },
    {
        do: (vertex, vertexes) => {
            let prev = vertexes[vertexes.length - 1];
            if (!prev) return true;

            if (prev.isLast() && vertex.isFirst()) {
                return false;
            }
            if (prev.id + 1 === vertex.id) {
                return false;
            }

            return true;
        },
        description: 'Current vertex cannot be one place away from previous one (anti-clock wise)',
    },
    {
        do: (vertex, vertexes) => {
            let prev = vertexes[vertexes.length - 1];
            if (!prev) return true;

            // return prev.isNeighbour(vertex) ? true : false;

            if (vertex.id === 1 && prev.id === vertex.totalPoints) {
                return true;
            }

            if (vertex.id === vertex.totalPoints && prev.id === 1) {
                return true;
            }

            if (Math.abs(vertex.id - prev.id) > 1) {
                return false;
            }

            return true;
        },
        description: 'Current vertex cannot be 2 places away from previous one (Only neighbours are allowed)',
    },
    {
        do: (vertex, vertexes) => {
            let prev = vertexes[vertexes.length - 1];
            let pprev = vertexes[vertexes.length - 2];

            if (prev && pprev) {
                if (prev.id === pprev.id) {

                    return vertex.isNeighbour(prev) ? false : true;
                }
            }

            return true;
        },
        description: 'A point inside a square repeatedly jumps half of the distance towards a randomly chosen vertex, but the currently chosen vertex cannot neighbor the previously chosen vertex if the two previously chosen vertices are the same.'
    }
];

class Point {
    constructor(x, y, id = null, totalPoints = null) {
        this.x = x;
        this.y = y;
        this.id = id
        this.totalPoints = totalPoints;
    }

    isNeighbour(point) {
        if (this.totalPoints === null) {
            return true;
        }

        if (this.id === 1 && point.id === this.totalPoints) {
            return true;
        }

        if (this.id === this.totalPoints && point.id === 1) {
            return true;
        }

        return Math.abs(this.id - point.id) === 1;
    }

    isFirst() {
        return this.id === 1;
    }

    isLast() {
        return this.id === this.totalPoints;
    }
}

class Canvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.pixelSize = 2;
    }

    drawPixel(x, y, size = this.pixelSize) {
        this.ctx.fillRect(x, y, size, size);
    }

    drawText(text, x, y) {
        this.ctx.fillText(text, x, y);
    }

    getMiddlePoint() {
        return new Point(this.canvas.width / 2, this.canvas.height / 2);
    }

    drawAtTheMiddle(size = this.pixelSize) {
        this.ctx.fillRect(this.canvas.width / 2, this.canvas.height / 2, size, size);
    }

    reset() {
        this.ctx.clearRect(0, 0, this.w, this.h);
    }

    get w() {
        return this.canvas.width;
    }

    get h() {
        return this.canvas.height;
    }
}

class Game {
    constructor(canvas, restrictions = []) {
        this.canvas = canvas;
        this.MAX_POINTS = this.initMaxPoints();
        this.currentIteration = 0;
        this.points = [];
        this.vertexes = [];
        this.reqAnimId = null;
        this.restrictions = restrictions;
        this.currentRestriction = null;
        this.colorMap = new Map()
            .set(1, 'rgba(255, 0, 0, 0.5)')
            .set(2, 'rgba(0, 0, 255, 0.5)')
            .set(3, 'rgba(0, 255, 0, 0.5)')
            .set(4, 'rgba(255, 0, 255, 0.5)')
            .set(5, 'rgba(0, 255, 255, 0.5)')
            .set(6, 'rgba(255, 255, 0, 0.5)')
            .set(7, 'rgba(127, 0, 255, 0.5)')
            .set(8, 'rgba(0, 255, 127, 0.5)')
            .set(9, 'rgba(255, 127, 0, 0.5)')
            .set(10, 'rgba(0, 127, 255, 0.5)')
            .set(11, 'rgba(127, 255, 0, 0.5)')
            .set(12, 'rgba(255, 0, 127, 0.5)')
    }

    run() {
        if (this.currentIteration > this.MAX_ITER) {
            this.stop();
            return;
        }
        this.currentIteration += this.SKIP_ITER;
        this.loop();
        this.reqAnimId = requestAnimationFrame(this.run.bind(this));
    }

    loop() {
        let localIter = 0;

        while (localIter < this.SKIP_ITER) {
            if (this.vertexes.length > 5) {
                this.vertexes.shift();
            }
            let prev = this.vertexes[this.vertexes.length - 1];
            let next = this.getNextPoint()
            let mid = this.getMidPointBetween(prev, next);
            this.vertexes.push(mid);

            this.canvas.ctx.fillStyle = this.colorMap.get(mid.id);
            this.canvas.drawPixel(mid.x, mid.y);
            localIter += 1;
            this.updateIterationText();
        }
    }

    updateIterationText() {
        document.getElementById('iterations').innerHTML = this.currentIteration;
    }

    getNextPoint() {
        let id = this.rand();

        let p = this.points.find(p => p.id === id);
        if (this.currentRestriction) {
            return this.currentRestriction.do(p, this.vertexes) ? p : this.getNextPoint();
        }

        return p;
    }

    rand() {
        return Math.floor(Math.random() * (this.points.length) + 1);
    }

    getMidPointBetween(prev, next) {
        return new Point(
            (prev.x + next.x) / 2,
            (prev.y + next.y) / 2,
            next.id,
            this.points.length
        )
    }

    start(config) {
        this.stop();
        this.MAX_ITER = config.has('max-iterations') ? parseInt(config.get('max-iterations')) : 200_000;
        this.SKIP_ITER = config.has('skip-iterations') ? parseInt(config.get('skip-iterations')) : 500;
        this.currentRestriction = config.has('restrictions')
            && config.get('restrictions') !== "null" ?
            this.restrictions[parseInt(config.get('restrictions'))] :
            null;

        this.currentIteration = 0;
        this.initPoints();

        this.canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.drawPoints();

        this.canvas.ctx.fillStyle = "rgba(0, 0, 0, 0.3)"

        let initialPoint = this.canvas.getMiddlePoint();
        initialPoint.id = 1;
        this.vertexes.push(initialPoint);

        this.run();
    }

    stop() {
        cancelAnimationFrame(this.reqAnimId);
    }
    /**
     * Creates fixed number of points and sets position to be evenly distributed on a circle clockwise
     * For 3 points creates equiliteral triangle, for 4 points creates square etc
     */
    initPoints() {
        this.points = [];

        let r = (this.canvas.h / 2) - 50;
        let step = 360 / this.MAX_POINTS;
        let middle = this.canvas.getMiddlePoint();

        let even = this.MAX_POINTS % 2 === 0;

        for (
            //if odd then we want first point to be at the top Center
            //if even then we want first point to be at the top Corner
            let i = 0, s = even ? step / 2 : 90;
            i < this.MAX_POINTS;
            i++ , s -= step //substract step so we go clockwise
        ) {
            let tx = middle.x + r * Math.cos(s * (Math.PI / 180));
            let ty = middle.y + r * Math.sin(-s * (Math.PI / 180));
            this.points.push(new Point(tx, ty, i + 1, this.MAX_POINTS));
        }

    }

    drawPoints() {
        this.canvas.reset();

        this.points.forEach(point => {
            this.canvas.drawPixel(point.x, point.y, 5);
            this.canvas.drawText(point.id, point.x + 10, point.y + 10);
        });

    }

    initMaxPoints() {
        const pointsInput = document.getElementById('points');
        let maxPoints = parseInt(pointsInput.value);
        pointsInput.addEventListener('change', (e) => {
            this.stop();
            let number = parseInt(e.target.value);
            if (window.isNaN(number)) {
                return;
            }
            this.MAX_POINTS = number;
        });

        return maxPoints;
    }
}

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
