import Point from './Point'

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
        this.MAX_ITER = config.has('max-iterations') ? parseInt(config.get('max-iterations')) : 200000;
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

export default Game;