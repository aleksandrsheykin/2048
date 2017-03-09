
var Game = function () {
    this.mousedown = false;
    this.gameOver = true;
    this.step = false;
    this.$boxes = $('#boxes');
    this.points = 0;
    this.cursorPoints = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    }
    this.F_SIZE = 4;	//размер поля
    this.fieldMas = [];
    this.isAlready = [];    //в этой ячейке уже произошло объединение
};

Game.prototype.reset = function() {
    for (var i = 0; i < this.F_SIZE; i++){
        this.fieldMas[i] = [];
        this.isAlready[i] = [];
        for (var j = 0; j < this.F_SIZE; j++){
            this.fieldMas[i][j] = 0;
            this.isAlready[i][j] = 0;
    }}
    this.fieldMas[0][0] = 2;
    this.points = 0;
    this.writeBox();
};

Game.prototype.writeBox = function() {	//расставляет фишки на поле
    var m = this.fieldMas;
    this.$boxes.text('');
    for (var i = 0; i < m.length; i++) {
        for (var j = 0; j < m[i].length; j++) {
            if (m[i][j] > 0) {
                $boxes.append('<div class="thing t'+m[i][j]+'" style="top: '+i*100+'px; left: '+j*100+'px;" id="'+i+'x'+j+'"></div>');
                $elem = $('#'+i+'x'+j);
                $elem.animate({ width: "80px",
                                opacity: 0.5,
                                marginLeft: "5px",
                              }, 100 )
                    .animate({ width: "100px",
                                opacity: 1,
                                marginLeft: "0px",
                              }, 100 )
            }
        }
    }
    var $p = $('#points');
    $p.text(points);
}

Game.prototype.start = function() {
    $('#bar').hide();
    $('#gameOver').hide();    
}

Game.prototype.getVector = function() {
    var c = this.cursorPoints;
    hShift = c.startX-c.endX;
    vShift = c.startY-c.endY;
    
    if ((c.startX == c.endX) && (c.startY == c.endY)) { //просто кликнули и не сдвинули
        return false;
    }
    
    if (Math.abs(hShift) > Math.abs(vShift)) {
        if (hShift<0) { 
            return 'right'; 
        } else {
            return 'left';
        }
    } else {
        if (vShift<0) { 
            return 'down'; 
        } else {
            return 'up';
        }
    }    
}




$playfield.unbind('mouseup').mouseup(function (e) {
    cursorPoints.endX = e.pageX-$(this).offset().left;	//запоминаем конечную точку
    cursorPoints.endY = e.pageY-$(this).offset().top;
    if (mousedown == true) {
        vector = getCursorVector(cursorPoints);
        if (vector) {
            mainCalculate(vector, fieldMas);
            newStep();
            writeBox(fieldMas);
            setTimeout(addBlockWithAnimation, 200);
        }
    }
    mousedown = false;
});


function mainCalculate(vector, m) {	//сдвиг
    step = false;
    //крутим массив под правый сдвиг
    if ((vector == 'up') || (vector == 'down')) {
        m = swingField(m, vector);
    } else if (vector == 'left') {
        m = reflectionField(m);
    }
    
    for (var i = 0; i < m.length; i++) {
        for (var j = m[i].length-1; j >= 0; j--) {
        
            if (j == m[i].length-1) {	//первая
                if (m[i][j] == 0) {
                    if (getIndexNext(m, i, j, 1) !== false) {
                        m[i][j] = getValueNext(m, i, j, 1);
                        m[i][getIndexNext(m, i, j, 1)] = 0;
                        step = true;
                    }
                } else {
                    if (m[i][j] == getValueNext(m, i, j, 1)) {
                        m[i][j] += getValueNext(m, i, j, 1);
                        isAlready[i][j] = 1;
                        m[i][getIndexNext(m, i, j, 1)] = 0;
                        step = true;
                        points += m[i][j];
                    }
                }
                continue;
            }
            
            if (j == 0) { 	//последняя
                if (m[i][j] != 0 ) {
                    if (getIndexNext(m, i, j, 0) !== false) {
                        if (getValueNext(m, i, j, 0) == m[i][j]) {
                            m[i][getIndexNext(m, i, j, 0)] += m[i][j];
                            isAlready[i][getIndexNext(m, i, j, 0)] = 1;
                            m[i][j] = 0;
                            step = true;
                            points += m[i][getIndexNext(m, i, j, 0)];
                        } else {
                            var t = m[i][j];
                            m[i][j] = 0;
                            m[i][getIndexNext(m, i, j, 0)-1] = t;
                            step = true;
                        }
                    } 
                }
                continue;
            }
            
            if (m[i][j] == 0) {		//середина
                if (getIndexNext(m, i, j, 1) !== false) {
                    if (getIndexNext(m, i, j, 0) !== false) {
                        if (getValueNext(m, i, j, 1) == getValueNext(m, i, j, 0)) {
                            m[i][getIndexNext(m, i, j, 0)] += getValueNext(m, i, j, 1);
                            isAlready[i][getIndexNext(m, i, j, 0)] = 1;
                            m[i][getIndexNext(m, i, j, 1)] = 0;
                            step = true;
                            points += m[i][getIndexNext(m, i, j, 0)];
                        } else {
                            m[i][getIndexNext(m, i, j, 0)-1] = getValueNext(m, i, j, 1);
                            m[i][getIndexNext(m, i, j, 1)] = 0;
                            step = true;
                        }
                    } else {
                        m[i][j] = getValueNext(m, i, j, 1);
                        m[i][getIndexNext(m, i, j, 1)] = 0;
                        step = true;
                    }
                }
            } else {	//текущая не пустая
                if (getIndexNext(m, i, j, 0) !== false) {
                    if (m[i][j] == getValueNext(m, i, j, 0)) {
                        m[i][getIndexNext(m, i, j, 0)] += m[i][j];
                        isAlready[i][getIndexNext(m, i, j, 0)] = 1;
                        m[i][j] = 0;
                        step = true;
                        points += m[i][getIndexNext(m, i, j, 0)];
                    }
                } else {
                    if (getIndexNext(m, i, j, 1) !== false) {
                        if (m[i][j] == getValueNext(m, i, j, 1)) {
                            m[i][j] += getValueNext(m, i, j, 1);
                            isAlready[i][j] = 1;
                            m[i][getIndexNext(m, i, j, 1)] = 0;
                            step = true;
                            points += m[i][j];
                        }
                    } 
                }
            }
        }
    }
    
    //крутим обратно
    if ((vector == 'up') || (vector == 'down')) {
        m = swingField(m, vector=='up'?'down':'up');
    } else if (vector == 'left') {
        m = reflectionField(m);
    }

}

function getIndexNext(m, i, j, left) {	//возвращает индекс ближайшего не пустого
    if (left == 1) {
        for (var a = j-1; a>=0; a--) {
            if (m[i][a] != 0) {
                return a;
            }
        }
    } else {
        for (var a = j+1; a<=m.length-1; a++) {
            if (m[i][a] != 0) {
                return a;
            }
        }
    }
    return false;
}

function getValueNext(m, i, j, left) {	//возвращает значение ближайшего доступного
    if (left == 1) {
        for (var a = j-1; a>=0; a--) {
            if (m[i][a] != 0) {
                if (isAlready[i][a] == 1) { return false; }
                return m[i][a];
            }
        }
    } else {
        for (var a = j+1; a<=m.length-1; a++) {
            if (m[i][a] != 0) {
                if (isAlready[i][a] == 1) { return false; }
                return m[i][a];
            }
        }
    }
    return false;
}

function reflectionField(m) {	//отражаем массив по вертикали
    var t = [];
    for (var i = 0; i <= m.length-1; i++) {
        var l = m[i].length
        for (var j = 0; j <= l/2-1; j++) {
            t = m[i][j];
            m[i][j] = m[i][l-j-1];
            m[i][l-j-1] = t;
        }
    }
    return m;
}

function newStep() {
    gameOver = true;
    for (var i = 0; i < isAlready.length; i++){
        for (var j = 0; j < isAlready.length; j++){
            if (isAlready[i][j] != 0) { gameOver = false; }
            isAlready[i][j] = 0;
        }
    }
}

function swingField(m, v) {	//вращаем массив
    var n = m.length;
    if (v == 'down') {	//против часовой
        for (var i = 0; i < n/2; i++) {
            for (var j=i; j < n-1-i; j++) {
                var tmp = m[i][j];
                m[i][j] = m[j][n-1-i];
                m[j][n-1-i] = m[n-1-i][n-1-j];
                m[n-1-i][n-1-j] = m[n-1-j][i];
                m[n-1-j][i] = tmp;
            }
        }
    } else {			//по часовой
        for (var i=0; i < n/2; i++) {
            for (var j=i; j < n-1-i; j++) {
                var tmp = m[i][j];
                m[i][j] = m[n-j-1][i];
                m[n-j-1][i] = m[n-i-1][n-j-1];
                m[n-i-1][n-j-1] = m[j][n-i-1];
                m[j][n-i-1] = tmp;
            }
        }
    }
    return m;
}

function addBlockWithAnimation() {	//добавляет новую фишку на поле

    if (!step) {
        return;
    }

    //рандом			
    var tmp = [];	
    for (var i = 0; i < fieldMas.length; i++){
        for (var j = 0; j < fieldMas.length; j++){
            if (fieldMas[i][j] == 0) {
                tmp.push([i, j]);
            }
        }
    }
    
    if (gameOver == true && tmp.length == 0) { 	//game over
        $('#bar').show();
        $('#gameOver').text(points);
        $('#gameOver').show();
        reset();
        return;
    } else {
        var t = Math.floor(Math.random() * (tmp.length) + 1)-1;
        fieldMas[tmp[t][0]][tmp[t][1]] = (Math.floor(Math.random()*9)+1)==9?4:2;	//вставляем 2 или 4 в рандомную свободную клетку
    }

    $boxes.append('<div class="thing t'+fieldMas[tmp[t][0]][tmp[t][1]]+'" style="opacity: 0; top: '+tmp[t][0]*100+'px; left: '+tmp[t][1]*100+'px;" id="'+tmp[t][0]+'x'+tmp[t][1]+'"></div>');

    $elem = $('#'+tmp[t][0]+'x'+tmp[t][1]);
    $elem.animate({ opacity: 1, }, 150 )
}
