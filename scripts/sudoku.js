var sudoData = {
    grid: (function() {
        var arr = [[], [], [], [], [], [], [], [], []];

        for (var i = 0; i < 9; i++){
            for (var j = 0; j < 9; j++){
                arr[i][j] = 0;
            }
        }
        return arr;
    })(),
    
    knownNumbers: [],
    
    candidates: [], 
    
    solved: false,
    
    outputText: ""
}

var sudokuGrid = {
    
    getNumbers: function(){
        for (var i = 0; i < 81; i++){
            /*
            * Each input was named n0 - n80 in the script on the bottom of the HTML document
            * This means we can collect the inputs using a loop
            * id will be the name of the input. row and column will convert an index (i) 0-80 to
            * the row and column that cell belongs in.
            */
            var id = "n" + i,
                row = Math.floor(i / 9),
                column = i % 9;
    
            // If the input is not empty, we put the number into our array for use by our methods
            if (document.forms["sform"][id].value != ""){
                sudoData.grid[row][column] = parseInt(document.forms["sform"][id].value);
                sudoData.knownNumbers.push(row+" "+column);
            }

        }
        // Store the grid in lastGrid so we can 'unsolve' later.
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                grids.lastGrid[x][y] = sudoData.grid[x][y];
            }
        }
    },
    
    checkSolved: function() {
        // If any box has one candidate and is not filled in, we fill it with 
        // the candidate and add the box to knownNumbers.
        for (var i = 0; i < 9; i++){
            for (var j = 0; j < 9; j++){
                if (sudoData.candidates[i][j].length == 1 && sudoData.grid[i][j] === 0) {
                    sudoData.grid[i][j] = sudoData.candidates[i][j][0];
                    sudoData.knownNumbers.push(i+" "+j);
                }
            }
        }
        this.outputToGrid(sudoData.grid);
    },
    
    candidatesMarked: 0,
    
    findCandidates: function() {
        /* 
        * allCandidates will be a 2D array consisting of all possible candidates
        * in each cell. The candidates for a cell will be indexed by the index of 
        * the cell itself. This means that the candidates for the 9th cell is 
        * found at allCandidates[0][8] and for the 18th cell at allCandidates[1][8].
        */
        var allCandidates = [];

        for (var row = 0; row < 9; row++) {
            
            var rowCandidates = [[], [], [], [], [], [], [], [], []];
            
            for (var column = 0; column < 9; column++) {
        
                for (var num = 1; num < 10; num++) {

                    if( this.isValid(num, row, column) ) {
                        rowCandidates[column].push(num);
                        // Count candidates noted as this is considered a step in solving.
                        this.candidatesMarked++;
                    }

                }
                
            }
            
            allCandidates[row] = rowCandidates;
            
        }
        return allCandidates;
    },
    
    isValid: function(number, row, column) {
        /*
        * startingColumn and startingRow will be the first column and 
        * row in each box. So if row is 5, the starting row is 3, since
        * it will be in the second box from the top, which has rows 3, 4, 5.
        * Rows and columns are arrays so the first row or column is represented
        * by the index [0] and not [1]. 
        */
        
        var startingColumn = ( Math.ceil( (column + 1) / 3) - 1 ) * 3,
            startingRow = ( Math.ceil( (row + 1) / 3) - 1 ) * 3;
        
        for (var d=0;d<3;d++) {
            
            for (var j=0;j<3;j++) {
                /*
                * We add the numbers 0-2 to both starting row and column to
                * check the whole box. If the selected row and column are
                * the same as the position we want to check, it is ignored.
                * We push all the values into boxNumbers.
                */
                if ( (d+startingColumn != column && j+startingRow != row) && 
                      sudoData.grid[j+startingRow][d+startingColumn] == number )
                {
                    return false;
                } 
            }
            
        }
        
        for (var i=0;i<9;i++) {
            // Check for number in row
            if ( sudoData.grid[row][i] == number && i != column ) {
                return false;
            }
            // Check for number in column
            else if( sudoData.grid[i][column] == number && i != row ) {
                return false;
            }
        }
        
        return true; 
    },
    
    outputToGrid: function(gridArray) {
        // Fill form with values from array, i.e. outputting any array.
        for (var i=0;i<81;i++){
            var row = Math.floor(i/9),
                index = i===0 ? 0 : i%9,
                id = "n"+i,
                val = ""+gridArray[row][index];

            document.forms["sform"][id].value = gridArray[row][index] === 0 ? "" : val;
        }
    }, 
    
    unSolve: function(){
        if (!sudoData.solved) {
            alert("You cannot unsolve something that has not been solved.")
        }
        else {
            this.outputToGrid(grids.lastGrid);
            sudoData.solved = false;
            backtrack.testedNumbers = 0;
            backtrack.erasedNumbers = 0;
            this.candidatesMarked = 0;
            sudoData.knownNumbers = [];
            sudoData.candidates = [];
            sudoData.outputText = "";
            noBrute.foundDoubles = [];
            noBrute.foundSingles = [];
        }
        
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                sudoData.grid[x][y] = grids.lastGrid[x][y];
            }
        }
    }, 
    
    reset: function() {
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                sudoData.grid[x][y] = 0;
            }
        }
        sudoData.solved = false;
        sudoData.knownNumbers = [];
        sudoData.candidates = [];
        sudoData.outputText = "";
        backtrack.testedNumbers = 0;
        backtrack.erasedNumbers = 0;
        this.candidatesMarked = 0;
        noBrute.foundDoubles = [];
        noBrute.foundSingles = [];
        this.outputToGrid(sudoData.grid);
    }

}