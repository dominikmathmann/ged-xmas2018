import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { PuzzlePieceComponent } from './puzzle/puzzle-piece/puzzle-piece.component';

@NgModule({
  declarations: [AppComponent, PuzzleComponent, PuzzlePieceComponent],
  imports: [BrowserModule],
  providers: [],
  entryComponents: [PuzzlePieceComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
