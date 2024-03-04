var board = new Array();
var score = 0;

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;
var hasConflicted = new Array();

$(document).ready(function() {
    prepareForMobile();
    newgame();
});

function prepareForMobile() {
    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}

function newgame() {

    // 1.初始化棋盘
    init();

    // 2.随机两个格子生成数字
    generateOneNumber(); //随机生成一个
    generateOneNumber(); //随机生成一个
}

function init() {
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    updateBoardView();
    score = 0;
    updateScore(score);
}

document.addEventListener('touchstart', function(event) {
    //事件监听器
    //监听touchstart事件，当捕捉到则相应一个匿名函数
    startx = event.touches[0].pageX; //touches数组记录几个手机触摸的数据
    starty = event.touches[0].pageY;
});



document.addEventListener('touchend', function(event) {
    //事件监听器
    //监听touchend事件，当捕捉到则相应一个匿名函数
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    // 这里的y轴方向是向下的，x轴方向向右
    var deltax = endx - startx;
    var deltay = endy - starty;

    // 判断一下用户是点击还是滑动
    // 同时小于某个阈值，则判断为点击
    if (Math.abs(deltax) < 0.3 * documentWidth && Math.abs(deltay) < 0.3 * documentWidth)
        return;

    //如果x轴位移距离大于y轴位移距离，则判断在x轴移动
    if (Math.abs(deltax) >= Math.abs(deltay)) {
        if (deltax > 0) {
            // move right
            if (moveRight()) { //如果真的可以左移
                setTimeout("generateOneNumber()", 210); //生成一个新的数
                setTimeout("isgameover()", 300); //判断游戏是否结束
            }
        } else { // move left
            if (moveLeft()) { //如果真的可以左移
                setTimeout("generateOneNumber()", 210); //生成一个新的数
                setTimeout("isgameover()", 300); //判断游戏是否结束
            }
        }
    }
    //否则在y轴进行
    else {
        if (deltay > 0) {
            // move down
            if (moveBottom()) { //如果真的可以左移
                setTimeout("generateOneNumber()", 210); //生成一个新的数
                setTimeout("isgameover()", 300); //判断游戏是否结束
            }
        } else { // move up
            if (moveTop()) { //如果真的可以左移
                setTimeout("generateOneNumber()", 210); //生成一个新的数
                setTimeout("isgameover()", 300); //判断游戏是否结束
            }
        }

    }
});


function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            $('#grid-container').append("<div class='number-cell' id='number-cell-" + i + "-" + j + "'></div>")
            var theNumberCell = $('#number-cell-' + i + '-' + j)

            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px')
                theNumberCell.css('height', '0px')
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2)
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2)
            } else {
                theNumberCell.css('width', cellSideLength)
                theNumberCell.css('height', cellSideLength)
                theNumberCell.css('top', getPosTop(i, j))
                theNumberCell.css('left', getPosLeft(i, j))
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]))
                theNumberCell.css('color', getNumberColor(board[i][j]))
                theNumberCell.text(board[i][j])
            }

            hasConflicted[i][j] = false;
        }
    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');
}

function generateOneNumber() {
    //nospace表示所有格子都没空间了
    if (nospace(board)) {
        return false;
    }

    //parseInt强制类型转换为int 
    //Math.floor返回一个小于等于里面数的最大整数，但是仍然为浮点数格式
    //Math.random随机生成0-1之间的数，不包括1
    //这样就能随机生成0 1 2 3
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    var times = 0;
    while (times < 50) {
        if (board[randx][randy] == 0) break;
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times++;
    }
    if (times == 50) {
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
    }
    var randNumber = Math.random() > 0.5 ? 2 : 4;
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    return true;
}
//基于玩家响应的游戏循环
$(document).keydown(function(event) {
    switch (event.keyCode) {
        case 37: //左
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 38: //上
            if (moveTop()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 39: //右
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 40: //下
            if (moveBottom()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
    }
});

//向左移动
//对每一个数字的左侧位置进行判断，判断是否可为落脚点
//落脚位置是否为空，即左边有空格子
//落脚位置数字和自身元素数字相等，则可以左移
//移动的途中不能有障碍物
function moveLeft() {
    if (!canMoveLeft(board)) return false;

    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] = 2 * board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200)
    return true;
}
//向上移动
//对每一个数字的上侧位置进行判断，判断是否可为落脚点
//落脚位置是否为空，即上边有空格子
//落脚位置数字和自身元素数字相等，则可以上移
//移动的途中不能有障碍物
function moveTop() {
    if (!canMoveTop(board)) return false;
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = 2 * board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}
//向右移动
//对每一个数字的上侧位置进行判断，判断是否可为落脚点
//落脚位置是否为空，即右边有空格子
//落脚位置数字和自身元素数字相等，则可以右移
//移动的途中不能有障碍物
function moveRight() {
    if (!canMoveRight(board)) return false;

    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = 2 * board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}
//向下移动
//对每一个数字的下侧位置进行判断，判断是否可为落脚点
//落脚位置是否为空，即下边有空格子
//落脚位置数字和自身元素数字相等，则可以下移
//移动的途中不能有障碍物
function moveBottom() {
    if (!canMoveBottom(board)) return false;

    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = 2 * board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}


function isgameover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert("Game over!");
}

function updateScore(score) {
    $("#score").text(score);
}