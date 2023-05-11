import {SquareTypesEnum} from "../enums/square-types.enum";

export class NQueensSolver {

  board: number[][] = [];

  constructor(private size: number){
    for(let i=0;i<size;i++){
      this.board[i] = [];
      for(let j=0; j<size; j++)
        this.board[i].push(SquareTypesEnum.Other)
    }
  }

  // checks if it's safe to place a queen in the coordinate
  private isSafe(row: number, col: number) {
    let i;
    let j;


    for (i = 0; i < col; i++) {
      if (this.board[row][i] === SquareTypesEnum.Queen) {
        return false;
      }
    }

    for (i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (this.board[i][j] == SquareTypesEnum.Queen) {
        return false;
      }
    }

    for (i = row, j = col; j >= 0 && i < this.size; i++, j--) {
      if (this.board[i][j] == SquareTypesEnum.Queen) {
        return false;
      }
    }


    return true;
  }

  // Recursive method to find a solution
  private solveNQUtil(col: number) {

    if (col >= this.size) {
      return true;
    }

    for (let i = 0; i < this.size; i++) {

      if (this.isSafe(i, col)) {
        this.board[i][col] = SquareTypesEnum.Queen;

        if (this.solveNQUtil(col + 1)) {
          return true;
        }

        this.board[i][col] = SquareTypesEnum.Other;
      }
    }

    /* When the queen cannot be places in any row */
    return false;
  }
  solve(){
    this.solveNQUtil(0);
    return this.board;
  }
}
