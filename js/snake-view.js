(function (){
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var View = SnakeGame.View = function ($el) {
    this.board = new SnakeGame.Board;
    this.$el = $el;
    this.render();
    this.bindEvents();
  };

  View.prototype.render = function (){
    this.$el.empty();
    this.$el.append(this.board.render());
  }

  View.prototype.bindEvents = function () {
    var view = this;
    $("body").on("keydown", function (event) {
      switch (event.keyCode) {
      case (87):
        view.board.snake.turn("N")
        break;
      case (65):
        view.board.snake.turn("W")
        break;
      case (83):
        view.board.snake.turn("S")
        break;
      case (68):
        view.board.snake.turn("E")
        break;
      case (38):
        view.board.snake.turn("N")
        break;
      case (37):
        view.board.snake.turn("W")
        break;
      case (40):
        view.board.snake.turn("S")
        break;
      case (39):
        view.board.snake.turn("E")
        break;
      default:
        break;
      }
    });
    $("#new-game").on("click", function (event) {
      view.board = new SnakeGame.Board;
      view.board.start();
      view.gamestate = setInterval(view.step.bind(view), view.board.interval);
    });
  };

  View.prototype.gameOver = function () {
    clearInterval(this.gamestate);
    alert("Game Over. Your score was " + this.board.score);
  };

  View.prototype.step = function (){
    try {
      this.board.snake.move();
    }
    catch (e) {
      this.gameOver();
    }
    this.board.possiblyPlaceApple();
    if (this.board.score === this.board.nextSpeedUp) {
      clearInterval(this.gamestate);
      this.board.speedUp();
      this.gamestate = setInterval(this.step.bind(this), this.board.interval);
    }
    this.render();
  }
})();
