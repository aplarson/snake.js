(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }
  
  var Snake = SnakeGame.Snake = function (board) {
    this.dir = "E";
    this.segments = [ (new Coord([0,0])), (new Coord([0,1])) ];
    this.board = board
    this.growth = 0
  }
  
  var Coord = SnakeGame.Coord = function (pos) {
    this.x = pos[1];
    this.y = pos[0];
    this.pos = pos;
  }
  
  Coord.prototype.plus = function (dir) {
    var pos = []
    switch (dir) {
    case "N":
      pos = [this.y - 1, this.x]
      break;
    case "S":
      pos = [this.y + 1, this.x]
      break;
    case "W":
      pos = [this.y, this.x - 1]
      break;
    case "E":
      pos = [this.y, this.x + 1]
      break;
    }

    return new Coord(pos);
    
  };
  
  Coord.prototype.atPos = function (pos) {
    if (this.y === pos[0] && this.x === pos[1]) {
      return true
    } else {
      return false
    }
  }
  
  Snake.prototype.move = function (){
    if (this.growth === 0) {
      var toBeRemoved = this.segments.shift();
    } else {
      this.growth -= 1;
    }
    var lastIdx = (this.segments.length - 1);
    var newCoord = this.segments[lastIdx].plus(this.dir);
    this.board.checkCollision(newCoord);
    this.board.checkInBounds(newCoord);
    this.segments.push(newCoord);
  }
  
  Snake.prototype.turn = function (dir){
    this.dir = dir;
  }
  
  Snake.prototype.grow = function () {
    this.growth += 4;
    this.board.score += 10;
  }
  
  var Board = SnakeGame.Board = function (){
    this.apples = []
    this.snake = new Snake (this)
    this.board = buildBoard(20)
    this.score = 0;
    this.interval = 300;
  }
  
  function buildBoard(dimensions) {
    var board = [];
    _.times(dimensions, function () {
      var row = [];
      _.times(dimensions, function () {
        row.push(null);
      })
      board.push(row);
    })
    return board;
  }
  
  Board.prototype.render = function () {
    var fn = this;
    var boardHTML = "<div class=\"board\">"
    this.board.forEach(function (el, idx) {
      boardHTML += "<div class=\"row\">"
     el.forEach(function (innerEl, innerIdx) {
       switch (fn.squareContents([idx, innerIdx])) {
       case "segment":
         boardHTML += "<div class=\"segment\"></div>"
         break;
       case "apple":
         boardHTML += "<div class=\"apple\"></div>"
         break;
       default:
         boardHTML += "<div class=\"empty\"></div>"
       }
     })
     boardHTML += "</div>"
    })
    return boardHTML += "</div>"
  };
  
  Board.prototype.checkInBounds = function (coord) {
    if ((coord.x < 0) || (coord.x >= this.board.length)){
      throw GameOverError
    } else if ((coord.y < 0) || (coord.y >= this.board.length)){
      throw GameOverError
    }
  } 
  
  Board.prototype.squareContents = function (pos) {
    var object = "empty"
    this.snake.segments.forEach(function (segment) {
      if (segment.atPos(pos)) {
        object = "segment"
      }
    })
    this.apples.forEach(function (apple) {
      if (apple.atPos(pos)) {
        object = "apple"
      }
    })
    return object;
  }
  
  Board.prototype.checkCollision = function (coord) {
    var contents = this.squareContents(coord.pos)
    switch (contents) {
    case "segment":
      throw GameOverError        
      break;
    case "apple":
      this.removeApple(coord);
      this.snake.grow();
      break;
    default:
      break;
    }
  }
  
  Board.prototype.removeApple = function(coord){
    var board = this;
    this.apples.forEach(function(apple, idx){
      if (apple.x === coord.x && apple.y === coord.y){
        board.apples.splice(idx, 1);
      }
    })
  }
  
  Board.prototype.possiblyPlaceApple = function () {
    var board = this
    
    if (this.apples.length < 1){
      _.times(5, function () {
        var pos = randomBoardPos(board.board.length)
        if (board.squareContents(pos) === "empty"){
          board.apples.push(new SnakeGame.Coord(pos))          
        }
         
      })
    }
    
  }
  
  function randomBoardPos(size) {
    var randY = Math.floor(Math.random() * size)
    var randX = Math.floor(Math.random() * size)
    return [randY, randX]
  }
  
})();