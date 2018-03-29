'use strict';

angular.module('Pyatnashki', ['ngSanitize'])
.controller('MainCtrl', ['$scope', function ($scope) {

    // Возможность ввода только числовых значений (от 3 до 9) для определения размера игрового поля
    document.getElementById('inputSize').onkeypress = function(e) {
        e = e || event;
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        var chr = getChar(e);
        // Отдельная проверка на chr == null
        if (chr == null) return;
        if (chr < '3' || chr > '9') {
            return false;
        }
    };
    // Возможность ввода только числовых значений (от 0 до 9) для кол-ва ходов перемешивания
    document.getElementById('inputMoves').onkeypress = function(e) {
        e = e || event;
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        var chr = getChar(e);
        // Отдельная проверка на chr == null
        if (chr == null) return;
        if (chr < '0' || chr > '9') {
            return false;
        }
    };
    function getChar(event) {
        if (event.which == null) {
            if (event.keyCode < 32) return null;
            return String.fromCharCode(event.keyCode) // Для IE
        }
        if (event.which !== 0 && event.charCode !== 0) {
            if (event.which < 32) return null;
            return String.fromCharCode(event.which) // Для остальных
        }
        return null;
    }

    // Установки по умолчанию
    $scope.isReady = false;
    // Размер игрового поля
    $scope.inputDefSize = "4";
    $scope.inputSize = $scope.inputDefSize;
    // Количество ходов для запутывания
    $scope.inputDefMoves = "400";
    $scope.inputMoves = $scope.inputDefMoves;
    // Определяем необходимость инверсии
    $scope.inverseDefSwitch = true;
    $scope.inverseSwitch = $scope.inverseDefSwitch;
    // Определяем стартовую позицию пустой клетки
    var startPos = {
        x: ($scope.inputSize-1), y: ($scope.inputSize-1)
    };
    // Создаем слушателя нажатия клавиш для управления
    var listener = new window.keypress.Listener();

    // Создаем двумерный массив выигрышной комбинации (в дальнейшем будем сравнивать его с двумерным массивом для игрового поля для определения выигрыша)
    var arr2DWin = [],
        arrNumWin = [],
        colWin = 0,
        numCounterWin;
    var test = function (arrNumWin, size) {

        // Создаем набор игровых костяшек
        var totalNumsWin = $scope.inputSize * $scope.inputSize + 1;
        for (numCounterWin = 1; numCounterWin < totalNumsWin; numCounterWin++) {
            arrNumWin.push(numCounterWin);
        }
        // Заполняем игровое поле костяшками
        for (var i = 0; i < size; i++) {
            arr2DWin[i] = [];
            for (var j = 0; j < size; j++) {

                if (arrNumWin[colWin] === size * size) {
                    arr2DWin[i][j] = "";
                    startPos.x = i;
                    startPos.y = j;
                } else {
                    arr2DWin[i][j] = arrNumWin[colWin];
                }
                colWin++;
            }
        }
        return arr2DWin;
    };

    // Создаем двумерный массив для игрового поля
    var arr2D = [],
        arrNum = [],
        col = 0,
        numCounter;
    var createFieldFromArrNum = function (arrNum, size) {

        // Создаем набор игровых костяшек
        var totalNums = $scope.inputSize * $scope.inputSize + 1;
        for (numCounter = 1; numCounter < totalNums; numCounter++) {
            arrNum.push(numCounter);
        }
        // Заполняем игровое поле костяшками
        for (var i = 0; i < size; i++) {
            arr2D[i] = [];
            for (var j = 0; j < size; j++) {

                if (arrNum[col] === size * size) {
                    arr2D[i][j] = "";
                    startPos.x = i;
                    startPos.y = j;
                } else {
                    arr2D[i][j] = arrNum[col];
                }
                col++;
            }
        }
        return arr2D;
    };

     // Перемешиваем костяшки на игровом поле в соответствии с заданным числом перемешиваний
     var movesCounter;
     var makeMoves = function (moves) {

        for (movesCounter = 0; movesCounter < moves; movesCounter++) {
            // Создаем рандомайзер на 4 значения (по числу направлений)
            var arrDirection = ["up", "down", "left", "right"],
                randomEl = arrDirection[Math.floor(Math.random()*(arrDirection.length))];
            // Делаем шаг в "выпавшем" направлении
            if (randomEl === "up"){
                if (startPos.x + 1 < $scope.inputSize) {
                    $scope.dataNum[startPos.x][startPos.y] = $scope.dataNum[startPos.x + 1][startPos.y];
                    $scope.dataNum[startPos.x + 1][startPos.y] = "";
                    startPos.x++;
                }
            }
            else if (randomEl === "down"){
                if (startPos.x > 0) {
                    $scope.dataNum[startPos.x][startPos.y] = $scope.dataNum[startPos.x - 1][startPos.y];
                    $scope.dataNum[startPos.x - 1][startPos.y] = "";
                    startPos.x--;
                }
            }
            else if (randomEl === "left"){
                if (startPos.y + 1 < $scope.inputSize) {
                    $scope.dataNum[startPos.x][startPos.y] = $scope.dataNum[startPos.x][startPos.y + 1];
                    $scope.dataNum[startPos.x][startPos.y + 1] = "";
                    startPos.y++;
                }
            }
            else if (randomEl === "right"){
                if (startPos.y > 0) {
                    $scope.dataNum[startPos.x][startPos.y] = $scope.dataNum[startPos.x][startPos.y - 1];
                    $scope.dataNum[startPos.x][startPos.y - 1] = "";
                    startPos.y--;
                }
            }
        }
    };

    // Обрабатываем реакцию на нажатие стрелочек
    var upKey,
        downKey,
        leftKey,
        rightKey,
        inverse;
    var listenKeyboard = function () {

        // Стандартное управление
        if (inverse === true){
            upKey = "up";
            downKey = "down";
            leftKey = "left";
            rightKey = "right";
        }
        // Инвертированное управление
        else if (inverse === false) {
            upKey = "down";
            downKey = "up";
            leftKey = "right";
            rightKey = "left";
        }

        // Реакция на стрелочку вверх
        listener.simple_combo(upKey, function () {
            if (startPos.x + 1 < $scope.inputSize) {
                $scope.dataNum[startPos.x][startPos.y] = $scope.dataNum[startPos.x + 1][startPos.y];
                $scope.dataNum[startPos.x + 1][startPos.y] = "";
                startPos.x++;
                $scope.$apply();
                //Проверка на выигрыш после хода
                if (JSON.stringify(arr2D) === JSON.stringify(arr2DWin)) {
                    document.getElementById('modal').style.display = "block";
                }
            }
        });
        // Реакция на стрелочку вниз
        listener.simple_combo(downKey, function () {
            if (startPos.x > 0) {
                $scope.dataNum[startPos.x][startPos.y] = $scope.dataNum[startPos.x - 1][startPos.y];
                $scope.dataNum[startPos.x - 1][startPos.y] = "";
                startPos.x--;
                $scope.$apply();
                //Проверка на выигрыш после хода
                if (JSON.stringify(arr2D) === JSON.stringify(arr2DWin)) {
                    document.getElementById('modal').style.display = "block";
                }
            }
        });
        // Реакция на стрелочку налево
        listener.simple_combo(leftKey, function () {
            if (startPos.y + 1 < $scope.inputSize) {
                $scope.dataNum[startPos.x][startPos.y] = $scope.dataNum[startPos.x][startPos.y + 1];
                $scope.dataNum[startPos.x][startPos.y + 1] = "";
                startPos.y++;
                $scope.$apply();
                //Проверка на выигрыш после хода
                if (JSON.stringify(arr2D) === JSON.stringify(arr2DWin)) {
                    document.getElementById('modal').style.display = "block";
                }
            }
        });
        // Реакция на стрелочку направо
        listener.simple_combo(rightKey, function () {
            if (startPos.y > 0) {
                $scope.dataNum[startPos.x][startPos.y] = $scope.dataNum[startPos.x][startPos.y - 1];
                $scope.dataNum[startPos.x][startPos.y - 1] = "";
                startPos.y--;
                $scope.$apply();
                //Проверка на выигрыш после хода
                if (JSON.stringify(arr2D) === JSON.stringify(arr2DWin)) {
                    document.getElementById('modal').style.display = "block";
                }
            }
        });
    };

    // Начать новую игру (создаем игровое поле из ранее подготовленных составляющих)
    $scope.newGame = function () {
        document.getElementById("newGame").style.display = "none";
        document.getElementById("endGame").style.display = "block";
        var size = parseInt($scope.inputSize),
            moves = parseInt($scope.inputMoves); // ParseInt в т.ч. помогает обработать данные, начинающиеся с "0"
        inverse = $scope.inverseSwitch;
        $scope.dataNum = createFieldFromArrNum(arrNum, size);
        $scope.dataNumWin = test(arrNumWin, size);
        $scope.dataNumChange = makeMoves(moves);
        $scope.isReady = true;
        //Проверка на выигрыш, если изначальное положение уже выигрышное
        if (JSON.stringify(arr2D) === JSON.stringify(arr2DWin)) {
            document.getElementById('modal').style.display = "block";
        }
        listenKeyboard();
    };
    // Победа
    $scope.winGame = function () {
        document.getElementById("newGame").style.display = "block";
        document.getElementById("endGame").style.display = "none";
        $scope.isReady = false;
        window.location.reload();
    };
    // Закончить игру
    $scope.gameOver = function () {
        document.getElementById("newGame").style.display = "block";
        document.getElementById("endGame").style.display = "none";
        $scope.isReady = false;
        window.location.reload();
    };
}]);