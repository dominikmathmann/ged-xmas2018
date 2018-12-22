import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Injector,
  Input,
  HostBinding,
  ComponentRef,
  ViewRef,
  Output,
  ViewChildren,
  QueryList,
  ContentChildren,
  EventEmitter
} from '@angular/core';
import { PuzzlePieceComponent } from './puzzle-piece/puzzle-piece.component';

@Component({
  selector: 'GED-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {
  @ViewChild('croot', { read: ViewContainerRef })
  rootContainer: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver, private injector: Injector) {}

  @Input()
  rows = 4;

  @Input()
  columns = 3;

  @Input()
  containerWidth;

  @Input()
  imagePath = '../../assets/images/';

  @Output()
  finished = new EventEmitter<boolean>();

  moves = 0;

  puzzlePieces: ComponentRef<PuzzlePieceComponent>[] = [];

  private emptyPuzzle: ComponentRef<PuzzlePieceComponent>;

  ngOnInit() {
    let counter = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        const createdComponent = this.createPuzzlePiece(r, c, counter++);
        this.puzzlePieces.push(createdComponent);
        if (!this.containerWidth) {
          this.containerWidth = createdComponent.instance.width * this.columns + this.columns * 3;
        }
      }
    }

    setTimeout(() => {
      for (let i = 0; i < 250; i++) {
        let rnd = Math.floor(Math.random() * (this.columns * this.rows));
        this.puzzleSwitchByIndex(rnd);
      }
    }, 2000);
  }

  private createPuzzlePiece(x: number, y: number, index: number) {
    const image = `${this.imagePath}${x}${y}.png`;
    const pieceFactory = this.resolver.resolveComponentFactory(PuzzlePieceComponent);
    const component = this.rootContainer.createComponent<PuzzlePieceComponent>(pieceFactory);

    component.instance.class = 'col-' + 12 / this.columns;
    component.instance.image = image;
    component.instance.viewRef = component.hostView;
    component.instance.index = index;

    if (index == this.columns * this.rows - 1) {
      component.instance.empty = true;
      this.emptyPuzzle = component;
    }
    component.instance.click.subscribe(e => this.puzzlePieceClicked(e));

    return component;
  }

  puzzlePieceClicked(pp: PuzzlePieceComponent) {
    if (this.validateMove(pp.viewRef, this.emptyPuzzle.hostView)) {
      this.moves++;
      this.puzzleSwitch(pp.viewRef);
    }

    this.finished.emit(this.validateFinish());
  }

  puzzleSwitch(pieceToMove: ViewRef) {
    const emptyView = this.emptyPuzzle.hostView;
    const emptyIndex = this.rootContainer.indexOf(emptyView);
    const clickedIndex = this.rootContainer.indexOf(pieceToMove);

    this.rootContainer.move(emptyView, clickedIndex);
    this.rootContainer.move(pieceToMove, emptyIndex);
  }

  puzzleSwitchByIndex(switchElementIndex: number) {
    const viewRef = this.rootContainer.get(switchElementIndex);
    this.puzzleSwitch(viewRef);
  }

  private validateMove(source: ViewRef, target: ViewRef): boolean {
    const sourceIndex = this.rootContainer.indexOf(source);
    const targetIndex = this.rootContainer.indexOf(target);

    let allowedIndex = [targetIndex + 1, targetIndex - 1, targetIndex + this.columns, targetIndex - this.columns]
      .filter(e => e >= 0)
      .filter(e => e < this.rows * this.columns)
      .filter(
        e =>
          Math.floor(e / this.columns) === Math.floor(targetIndex / this.columns) ||
          targetIndex === sourceIndex + this.columns ||
          targetIndex === sourceIndex - this.columns
      );
    return allowedIndex.indexOf(sourceIndex) != -1;
  }

  private validateFinish() {
    return this.puzzlePieces.every(p => p.instance.index == this.rootContainer.indexOf(p.hostView));
  }
}
