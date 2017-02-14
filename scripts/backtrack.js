var backtrack = {

    testedNumbers: 0,
    
    erasedNumbers: 0,
    
    findValue: function(row, column, direction, candidates, useCandidates){

        var possible = useCandidates ? candidates[row][column] : [1, 2, 3, 4, 5, 6, 7, 8, 9],
            indexOfNumber = possible.indexOf(sudoData.grid[row][column]);
        
        if (!direction && indexOfNumber == possible.length - 1) {
            return false;
        }
        
        var testNumberIndex = direction ? 0 : indexOfNumber + 1;
        
        while (testNumberIndex < possible.length) {
            this.testedNumbers++;
            if (sudokuGrid.isValid(possible[testNumberIndex], row, column)) {
                return possible[testNumberIndex];
            }
            
            testNumberIndex++;
        }
        
        return false;
    },
    
    run: function(useCandidates, afterNoBrute){
        
        if (sudoData.solved) {
            alert("This puzzle is already solved");
            return;
        }
        
        sudokuGrid.getNumbers();
        
        var direction = true,
            candidates = sudokuGrid.findCandidates(),
            candNumber = useCandidates ? sudokuGrid.candidatesMarked : 0;
        
        if (!afterNoBrute) {
            sudoData.outputText += "<li>Candidates marked: "+candNumber+"</li>";
        }
        
        for (var cell = 0; cell < 81; cell++){
                
            var row = Math.floor(cell / 9),
                column = cell % 9;
            
            if (sudoData.knownNumbers.includes(row+" "+column)) {
                if (direction) {
                    continue;
                }
                else {
                    cell -= 2;
                    continue;
                }
            }

            var possibleNumber = this.findValue(row, column, direction, candidates, useCandidates);

            if (typeof possibleNumber == "number") {
                
                sudoData.grid[row][column] = possibleNumber;
                this.placedNumbers++;
                direction = true;

            }
            else {
                sudoData.grid[row][column] = 0;
                cell -= 2;
                this.erasedNumbers++;
                direction = false;

            }
                
        }
        sudoData.solved = true;
        sudoData.outputText += "<li>Backtracking tested numbers: "+this.testedNumbers+"</li>"+
                               "<li>Backtracking erased numbers: "+this.erasedNumbers+"</li>";
        sudokuGrid.outputToGrid(sudoData.grid);
        document.getElementById("outputlist").innerHTML = sudoData.outputText;
    } // End of run function
    
}