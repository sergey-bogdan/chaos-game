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

export default Point;