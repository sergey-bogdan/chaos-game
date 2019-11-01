import Point from './Point'

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

export default Canvas;