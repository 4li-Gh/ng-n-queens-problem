import {Component} from '@angular/core';
import {NQueensSolver} from './classes/n-queens-solver';
import {getDistinctHexColorCode} from "./tools/color";
import {SquareTypesVisualEnum} from "./enums/square-types-visual.enum";
import {BoardConfig} from "./config/board-config";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  count = BoardConfig.Size;
  left = BoardConfig.Size;
  board: { type: number, color?: string }[][] = [];
  colored = false;
  hideDots = false;

  readonly SquareTypes = SquareTypesVisualEnum;

  constructor() {
    this.refresh()
  }

  solve() {
    this.refresh();

    let queens = new NQueensSolver(this.count);
    queens.solve();
    queens.board.forEach((row, i) => {
      row.forEach((col, j) => {
        if (col === 1) {
          this.dotQueen(i, j);
        }
      });
    })
  }


  refresh() {
    if (!Number.isInteger(this.count)) {
      alert("count must be a positive integer");
      return;
    }

    if (this.count < BoardConfig.MinSize || this.count > BoardConfig.MaxSize) {
      alert(`Max count is ${BoardConfig.MaxSize} and min count is ${BoardConfig.MinSize}`);
      return;
    }

    // in case a float number is given
    this.count = Math.ceil(this.count);
    this.left = this.count;


    this.board = [];
    for (let i = 0; i < this.count; i++) {
      this.board.push([]);
      for (let j = 0; j < this.count; j++) {
        this.board[i].push({type: SquareTypesVisualEnum.Empty})
      }
    }

  }


  squareClicked(i: number, j: number) {
    if (this.board[i][j].type === SquareTypesVisualEnum.Empty) {
      this.board[i][j].type = SquareTypesVisualEnum.Queen;
      this.dotQueen(i, j)
    }
  }


  dotQueen(i: number, j: number) {
    const board = this.board;
    const queen = board[i][j];
    const generatedColors: string[] = [];
    queen.type = SquareTypesVisualEnum.Queen;

    if (this.colored) {
      const color = getDistinctHexColorCode(generatedColors);
      generatedColors.push(color);
      queen.color = color;
    }

    this.left--;
    const setColor = (i: number, j: number) => {
      this.board[i][j].color = queen.color ? queen.color : '';
    };

    this.findHitAreas(i, j).forEach((obj) => {
      setColor(obj.i, obj.j);
      this.board[obj.i][obj.j].type = SquareTypesVisualEnum.Hit;
    });
  }


  colorChanged() {

    if (this.colored) {
      this.board.forEach((row, i) => {
        row.forEach((col, j) => {
          if (col.type === SquareTypesVisualEnum.Queen) {
            this.dotQueen(i, j);
            this.left++;
          }
        })
      })

    } else {
      this.board.forEach((row) => {
        row.forEach(c => c.color = '')
      })
    }

  }

  // Looks for areas that are targeted by a queen
  findHitAreas(i: number, j: number): { i: number, j: number }[] {
    let areas = [];
    for (let x = 0; x < this.count; x++) {
      if (x !== i)
        areas.push({i: x, j: j});
      if (x !== j)
        areas.push({i: i, j: x});
    }

    let min = Math.min(i, j);
    let pointI = i - min;
    let pointJ = j - min;

    for (let x = 0; x < this.count - pointI && x < this.count - pointJ; x++) {
      if (i !== pointI + x)
        areas.push({i: pointI + x, j: pointJ + x})
    }

    min = Math.min(this.count - i - 1, j);
    pointI = i + min;
    pointJ = j - min;

    for (let x = 0; pointI - x >= 0 && x < this.count - pointJ; x++) {
      if (j !== pointJ + x)
        areas.push({i: pointI - x, j: pointJ + x})
    }

    return areas;
  }


}
