<template>
  <canvas id="game" ref="game"></canvas>
</template>

<script>
function isSizeTooSmall(val) {
  return (window.innerWidth / val) > 50 || (window.innerHeight / val) > 30;
}

export default {
  name: "GameView",
  methods: {
    draw() {
      const canvas = this.$refs.game;
      const ctx = canvas.getContext("2d");
      for (let i = 0; i < this.squares.length; i++) {
        for (let j = 0; j < this.squares[i].length; j++) {
          if (this.type === "berggren") {
            this.drawImageInSquare(ctx, this.squares[i][j], i, j);
            continue;
          }
          ctx.fillStyle = this.squares[i][j] ? "white" : "black";
          ctx.fillRect(i * this.squareSize, j * this.squareSize, this.squareSize, this.squareSize);
        }
      }
    },
    setUpCanvas() {
      const canvas = this.$refs.game;
      canvas.width = this.width;
      canvas.height = this.height;
      // add listeners for click and drag on canvas
      canvas.addEventListener("mousedown", this.onMouseDown);
      canvas.addEventListener("mouseup", this.onMouseUp);
      canvas.addEventListener("mousemove", this.onMouseMove);

      this.setUpSquares();
    },
    setUpSquares() {
      const canvas = this.$refs.game;
      const numSquaresX = Math.floor(canvas.width / this.squareSize);
      const numSquaresY = Math.floor(canvas.height / this.squareSize);
      this.squares = this.createArray(numSquaresX, numSquaresY);
      this.createInitialPattern();
    },
    createInitialPattern() {
      const midX = Math.floor(this.squares.length / 2);
      const midY = Math.floor(this.squares[0].length / 2);
      this.setSquare(midX, midY, true);
      this.setSquare(midX + 1, midY, true);
      this.setSquare(midX + 2, midY, true);
      this.setSquare(midX + 2, midY + 1, true);
      this.setSquare(midX + 1, midY + 2, true);

      this.setSquare(midX - 1, midY, true);
      this.setSquare(midX - 2, midY, true);
      this.setSquare(midX - 2, midY + 1, true);
      this.setSquare(midX - 1, midY + 2, true);


    },
    setSquare(x, y, value) {
      if (x < 0 || x >= this.squares.length || y < 0 || y >= this.squares[0].length) {
        return;
      }
      this.squares[x][y] = value;
    },
    createArray(numSquaresX, numSquaresY) {
      const squares = [];
      for (let i = 0; i < numSquaresX; i++) {
        squares[i] = [];
        for (let j = 0; j < numSquaresY; j++) {
          squares[i][j] = false;
        }
      }
      return squares;
    },
    update() {
      this.updateSquares();
      this.draw();
      setTimeout(this.update, 1000/6);
    },
    updateSquares() {
      if (this.isMouseDown) {
        return;
      }
      const squares = this.squares;
      const squaresCopy = this.createArray(squares.length, squares[0].length);
      for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squares[i].length; j++) {
          const numNeighbors = this.getNumNeighbors(squares, i, j);
          if (squares[i][j]) {
            squaresCopy[i][j] = !(numNeighbors < 2 || numNeighbors > 3);
            continue;
          }
          squaresCopy[i][j] = numNeighbors === 3;
        }
      }
      this.squares = squaresCopy;
    },
    getNumNeighbors(squares, x, y) {
      let numNeighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          if (squares[x + i] && squares[x + i][y + j]) {
            numNeighbors++;
          }
        }
      }
      return numNeighbors;
    },
    onMouseDown(e) {
      this.isMouseDown = true;
      this.onMouseMove(e);
    },
    onMouseUp() {
      this.isMouseDown = false;
    },
    onMouseMove(e) {
      if (!this.isMouseDown) {
        return;
      }
      const canvas = this.$refs.game;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / this.squareSize);
      const y = Math.floor((e.clientY - rect.top) / this.squareSize);
      this.setSquare(x, y, true);
      this.draw();
    },
    drawImageInSquare(ctx, value, x, y) {
      if (!value) {
        const img = new Image();
        img.src = "https://cdn.discordapp.com/emojis/994836521930723398.gif?size=44&quality=lossless";
        ctx.drawImage(img, x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
        return;
      }
      const img = new Image();
      img.src = "https://cdn.discordapp.com/emojis/1015738796987404489.webp?size=96&quality=lossless";
      ctx.fillStyle = "white";
      ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
      ctx.drawImage(img, x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
    }
  },
  computed: {
    width() {
      return window.innerWidth;
    },
    height() {
      return window.innerHeight;
    },

    squareSize() {
      if (this.$route.query.size) {
        let squareSize = parseInt(this.$route.query.size);
        if (squareSize < 5) {
          squareSize = 5;
        }
        if (isSizeTooSmall(squareSize)) {
          while (isSizeTooSmall(squareSize)) {
            squareSize++;
          }
          console.log(`Warning: increasing square size to ${squareSize}x${squareSize} to prevent lag`);
        }
        return squareSize;
      }
      return 40;
    },
    type() {
      let type = this.$route.query.type;
      if (type !== "berggren") {
        document.body.style.backgroundColor = "black";
        return "normal";
      }
      document.body.style.backgroundColor = "transparent";
      return "berggren";
    }
  },
  mounted() {
    this.setUpCanvas();
    this.update();
  },
  data() {
    return {
      squares: []
    };
  }
}
</script>

<style scoped>
#game {
  image-rendering: pixelated;
}
</style>