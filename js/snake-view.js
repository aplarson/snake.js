(function (){
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }
  
  var View = SnakeGame.View = function ($el) {
    this.board = new SnakeGame.Board;
    this.$el = $el;
    this.render();
    this.bindEvents();
    this.gamestate = setInterval(this.step.bind(this), this.board.interval);

  };
  
  View.prototype.step = function (){
    try {
    this.board.snake.move();      
    }
    catch (e){
      this.queryPlayAgain();
    }
    this.board.possiblyPlaceApple();
     
    this.render();
  }
  
  View.prototype.queryPlayAgain = function (){
    var view = this
    var again = prompt("Game over!  Would you like to play again? (Y/n)")
    if (again === 'n') {
      clearInterval(view.gamestate)
    } else {
      view.board = new SnakeGame.Board
    }
  }
  
  View.prototype.render = function (){
    this.$el.empty();
    this.$el.append(this.board.render());
  }
  
  View.prototype.bindEvents = function () {
    var fn = this;
    $("body").on("keydown", function(event){
      var currentTarget = event.currentTarget;
      var $currentTarget = $(currentTarget);
      switch (event.keyCode) {
      case (87):
        fn.board.snake.turn("N")
        break;
      case (65):
        fn.board.snake.turn("W")
        break;
      case (83):
        fn.board.snake.turn("S")
        break;
      case (68):
        fn.board.snake.turn("E")
        break;
      case (38):
        fn.board.snake.turn("N")
        break;
      case (37):
        fn.board.snake.turn("W")
        break;
      case (40):
        fn.board.snake.turn("S")
        break;
      case (39):
        fn.board.snake.turn("E")
        break;
      default:
        break;
      }
    });
  };
  
  
})();