documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92 * documentWidth;
cellSideLength = 0.18 * documentWidth;
cellSpace = 0.04 * documentWidth;



function getPosTop(i, j) {
    return cellSpace + i * (cellSpace + cellSideLength);
}

function getPosLeft(i, j) {
    return cellSpace + j * (cellSpace + cellSideLength);
}

function getNumberBackgroundColor(number) {
    switch (number) {
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#ede0c8";
            break;
        case 8:
            return "#f2b179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e3b";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#33b5e5";
            break;
        case 2048:
            return "#09c";
            break;
        case 4096:
            return "#a6c";
            break;
        case 28192:
            return "#93c";
            break;
    }
    return "black";
}

function getNumberColor(number) {
    if (number <= 4)
        return "#776e65";

    return "white";
}
//没有空间
function nospace(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0)
                return false;
        }

    return true; //都没空了
}
//是否可以左移
//要满足以下条件其一
//1.该数字左边是否有空即没有数字
//2.该数字左边的数字是否和自己想等
//注意，最左边一列不能再移了,即考虑二三四列12个元素
function canMoveLeft(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])
                    return true;
            }
        }
    return false;
}

function canMoveTop(board) {
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j])
                    return true;
            }
        }
    return false;
}

function canMoveRight(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j])
                    return true;
            }
        }
    return false;
}

function canMoveBottom(board) {
    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j])
                    return true;
            }
        }
    return false;
}
//水平方向上
//判断第row行，col1到col2列之间是否无障碍物,不包括col1，从col1+1开始
function noBlockHorizontal(row, col1, col2, board) {
    for (var i = col1 + 1; i < col2; i++) {
        if (board[row][i] != 0)
            return false;
    }
    return true;
}
//垂直方向上
//判断第col列，row1到row2之间是否无障碍物，不包括row1，从row1+1开始
function noBlockVertical(col, row1, row2, board) {
    for (var i = row1 + 1; i < row2; i++) {
        if (board[i][col] != 0)
            return false;
    }
    return true;
}

//不能移动
function nomove(board) {
    if (canMoveLeft(board) || canMoveRight(board) ||
        canMoveTop(board) || canMoveBottom(board))
        return false;

    return true;
}