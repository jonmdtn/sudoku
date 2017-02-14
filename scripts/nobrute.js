var noBrute = {
    
    countCandidateNumbers: function(candidates) {
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
        
        return [seenOnce, seenTwice];
    },
    
    foundDoubles: [],
    
    findDoubles: function(seenTwice, unit, index) {
        for (var c = 0; c < seenTwice.length; c+=3) { // Hidden doubles;
            for (var v = c+3; v < seenTwice.length; v+=3) {

                if ( (seenTwice[c+1] == seenTwice[v+1] && seenTwice[c+2] == seenTwice[v+2]) || 
                     (seenTwice[c+1] == seenTwice[v+2] && seenTwice[c+2] == seenTwice[v+1]) )
                {
                    var numberArr = [seenTwice[c], seenTwice[v]],
                        candidatesArr = [seenTwice[c+1], seenTwice[c+2]];
                    
                    if ( !this.foundDoubles.includes(candidatesArr[0]) && !this.foundDoubles.includes(candidatesArr[1]) ) {
                        for (var i = 0; i < candidatesArr.length; i++){
                            for (var j = 1; j < 10; j++){

                                if (!numberArr.includes(j) && candidatesArr[i].includes(j)) {
                                    var index = candidatesArr[i].indexOf(j);
                                    candidatesArr[i].splice(index, 1);
                                }
                            }
                        }
                        this.foundDoubles.push(candidatesArr[0], candidatesArr[1]);
                    }

                }
            }
        }
    },
    
    foundSingles: [],
    
    findSingles: function(seenOnce, unit, index) {
        for (var aa = 0; aa < seenOnce.length; aa += 2) { // Singles
            var number = seenOnce[aa],
                array = seenOnce[aa + 1];
            
            
            if ( array.length != 1 && !this.foundSingles.includes(number+" "+unit+" "+index) ) {
                for (var bb = 0; bb < array.length; bb++) {
                    if (array[bb] != number) {
                        array.splice(bb, 1);
                        bb -= 1;
                    }
                }
                this.foundSingles.push(number+" "+unit+" "+index);
            }
        }   
    },
    
    getColumnCandidates: function(column) {
        var array = [];
        for (var i = 0; i < 9; i++) {
            array[i] = sudoData.candidates[i][column];
        }
        return array;
    },
    
    getBoxCandidates: function(boxIndex) {
        var startingColumn = boxIndex % 3 * 3,
            startingRow = Math.floor(boxIndex/3) * 3,
            array = [];

        for (var rowCounter = 0; rowCounter < 3; rowCounter++) {

            for (var colCounter = 0; colCounter < 3; colCounter++) {

                array[(rowCounter*3)+colCounter] = sudoData.candidates[startingRow+rowCounter][startingColumn+colCounter];

            }

        }
        return array;
    },
    
    solveUnit: function(candidateArray, unit, index) {
        var countResult = this.countCandidateNumbers(candidateArray);
        var seenOnce = countResult[0],
            seenTwice = countResult[1];

        this.findSingles(seenOnce, unit, index);
        this.findDoubles(seenTwice, unit, index);
    },
 
    run: function(useCandidates) {
        
        if (sudoData.solved) {
            alert("This puzzle is already solved");
            return;
        }
        
        sudokuGrid.getNumbers();
        sudoData.candidates = sudokuGrid.findCandidates();
        var candidateUnit,
            knownNumbers = sudoData.knownNumbers.length;

        sudoData.outputText += "<li>Candidates marked: "+sudokuGrid.candidatesMarked+"</li>";
        
        for (var i = 0; i < 50; i++) {

            sudoData.candidates = sudokuGrid.findCandidates();
            for (var unitCount = 0; unitCount < 9; unitCount++) {
                candidateUnit = sudoData.candidates[unitCount];
                this.solveUnit(candidateUnit, "row", unitCount);
                candidateUnit = this.getColumnCandidates(unitCount);
                this.solveUnit(candidateUnit, "column", unitCount);
                candidateUnit = this.getBoxCandidates(unitCount);
                this.solveUnit(candidateUnit, "box", unitCount);
                checkSolved();
            }
        }
        var solvedCells = sudoData.knownNumbers.length - knownNumbers;
        
        sudoData.outputText += "<li>Singles spotted: "+this.foundSingles.length+"</li>"+
                               "<li>Doubles spotted: "+(this.foundDoubles.length / 2)+"</li>"+
                               "<li>Cells solved: "+solvedCells+"</li>";
        
        var solved = true;
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                if (sudoData.grid[x][y] === 0) {
                    solved = false;
                }
            }
        }
        
        if (solved) {
            sudoData.solved = true;
        }
        else {
            setTimeout(function(){
                backtrack.run(useCandidates, true);
                sudoData.solved = true;
            }, 2000);
        }
        document.getElementById("outputlist").innerHTML = sudoData.outputText;      
    }

} // End of noBrute object
