function test(){
    sudokuGrid.reset();
    var grid = [
        [0,0,0,0,0,0,0,0,0],
        [9,0,4,6,0,7,0,0,0],
        [0,7,6,8,0,4,1,0,0],
        [3,0,9,7,0,1,0,8,0],
        [7,0,8,0,0,0,3,0,1],
        [0,5,1,3,0,8,7,0,2],
        [0,0,7,5,0,2,6,1,0],
        [0,0,5,4,0,3,2,0,8],
        [0,0,0,0,0,0,0,0,0]
    ];
    
    /*var grid = [
        [8,0,0,0,0,0,1,4,7],
        [0,0,4,0,9,0,0,0,6],
        [0,2,3,7,0,0,8,0,0],
        [0,0,9,0,0,1,0,0,2],
        [0,0,0,3,2,0,0,0,0],
        [0,8,0,0,0,9,4,0,0],
        [0,0,1,0,0,0,0,0,0],
        [9,0,6,1,4,0,0,3,8],
        [5,0,0,0,6,3,0,0,0]
    ];*/
    
    sudokuGrid.outputToGrid(grid);
    
    //sudokuGrid.getNumbers();
    
    /*var t1=performance.now();
    sudoData.candidates = sudokuGrid.findCandidates();
    for (var i = 0; i < 1; i++){
        spotSingles();
        spotSingles();
        sudoData.candidates = sudokuGrid.findCandidates();
    }
    var t2 = performance.now()
    console.log(t2-t1);*/
}

function checkSolved(){
    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){
            if (sudoData.candidates[i][j].length == 1 && sudoData.grid[i][j] === 0) {
                sudoData.grid[i][j] = sudoData.candidates[i][j][0];
                sudoData.knownNumbers.push(i+" "+j);
                
            }
        }
    }
    sudokuGrid.outputToGrid(sudoData.grid);
}

function keepOnlyCandidates(numberArr, candidatesArr) {
    for (var i = 0; i < candidatesArr.length; i++){
        for (var j = 1; j < 10; j++){
            
            if (!numberArr.includes(j) && candidatesArr[i].includes(j)) {
                var index = candidatesArr[i].indexOf(j);
                candidatesArr[i].splice(index, 1);
                solvedCount++;
            }
            
        }
    }
}

function testrun(){
    sudoData.candidates = sudokuGrid.findCandidates();
        for (var i = 0; i < 9; i++){
            var can = sudoData.candidates[i];
            noBrute.solveUnit(can);
            can = getBoxCandidates(i);
            noBrute.solveUnit(can);
            can = getColumnCandidates(i);
            noBrute.solveUnit(can);
        }
    checkSolved();
}

function prob(){
    var t1 = performance.now();
    
    var test = true;
    while (test) {
        var current = solvedCount;
        testrun();
        var next = solvedCount;
        if (next == current){ test = false; }
    }
    testrun();
    testrun();
    testrun();
    var t2 = performance.now();
    console.log(t2-t1);
}

var solvedCount = 0;

function spotHiddenDoubles(candidates){
    var seenMoreThanTwice = [],
        seenTwice = [],
        seenOnce = [],
        index;

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < candidates[i].length; j++) {
            if ( seenMoreThanTwice.includes(candidates[i][j]) ) {
                continue;
            }
            else if ( seenTwice.includes(candidates[i][j]) ) {
                seenMoreThanTwice.push(candidates[i][j]);
                
                index = seenTwice.indexOf(candidates[i][j]);
                seenTwice.splice(index, 3);
            }
            else if ( seenOnce.includes(candidates[i][j]) ) {
                seenTwice.push(candidates[i][j], candidates[i]);
                
                index = seenOnce.indexOf(candidates[i][j]);
                seenTwice.push(seenOnce[index+1]);
                
                seenOnce.splice(index, 2);
            }
            else {
                seenOnce.push(candidates[i][j], candidates[i]);
            }
        }
    }
    
    for (var c = 0; c < seenTwice.length; c+=3) { // Hidden doubles;
        for (var v = c+3; v < seenTwice.length; v+=3) {
            
            if ( (seenTwice[c+1] == seenTwice[v+1] && seenTwice[c+2] == seenTwice[v+2]) || 
                 (seenTwice[c+1] == seenTwice[v+2] && seenTwice[c+2] == seenTwice[v+1]) )
            {
                var numberArr = [seenTwice[c], seenTwice[v]],
                    candidatesArr = [seenTwice[c+1], seenTwice[c+2]];
            
                (numberArr, candidatesArr) => {
                    for (var i = 0; i < candidatesArr.length; i++){
                        for (var j = 1; j < 10; j++){

                            if (!numberArr.includes(j) && candidatesArr[i].includes(j)) {
                                var index = candidatesArr[i].indexOf(j);
                                candidatesArr[i].splice(index, 1);
                                solvedCount++;
                            }

                        }
                    }
                }
                
                solvedCount++;
            }
        }
    }

    for (var aa = 0; aa < seenOnce.length; aa += 2) { // Singles
        var number = seenOnce[aa],
            array = seenOnce[aa + 1];
        
        for (var bb = 0; bb < array.length; bb++) {
            if (array[bb] != number) {
                array.splice(bb, 1);
                bb -= 1;
            }
        }
    }

}



function getColumnCandidates(column){
    var array = [];
    for (var i = 0; i < 9; i++) {
        array[i] = sudoData.candidates[i][column];
    }
    return array;
}

function getBoxCandidates(boxIndex){
    var startingColumn = boxIndex % 3 * 3,
        startingRow = Math.floor(boxIndex/3) * 3,
        array = [];
    
    for (var rowCounter = 0; rowCounter < 3; rowCounter++) {
        
        for (var colCounter = 0; colCounter < 3; colCounter++) {
            
            array[(rowCounter*3)+colCounter] = sudoData.candidates[startingRow+rowCounter][startingColumn+colCounter];
            
        }
        
    }
    return array;
}