import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ViewRef
} from '@angular/core';

@Component({
  selector: 'GED-puzzle-piece',
  templateUrl: './puzzle-piece.component.html',
  styleUrls: ['./puzzle-piece.component.scss']
})
export class PuzzlePieceComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  @Input()
  image: string;

  @Input()
  width = 200;

  @Input()
  height = 180;

  @HostBinding('class')
  class = 'default';

  empty: boolean;

  viewRef: ViewRef;

  index: number;

  @Output()
  click = new EventEmitter<PuzzlePieceComponent>();

  imageClick() {
    this.click.emit(this);
  }
}
