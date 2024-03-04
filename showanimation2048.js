//动画效果的显示数字
function showNumberWithAnimation(i, j, randNumber) {
    var numberCell = $('#number-cell-' + i + '-' + j);
    numberCell.css('background-color', getNumberBackgroundColor(randNumber));
    numberCell.css('color', getNumberColor(randNumber));
    numberCell.text(randNumber);
    //动画部分，用jquery的animate函数完成
    numberCell.animate({
        //宽高改变，从0到100
        width: cellSideLength,
        height: cellSideLength,
        //位置改变，从grid-cell的中心转成与grid-cell相同大小
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 50);
}
//移动动画
function showMoveAnimation(fromx, fromy, tox, toy) {
    var numberCell = $('#number-cell-' + fromx + '-' + fromy);
    numberCell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox, toy)
    }, 200)
}