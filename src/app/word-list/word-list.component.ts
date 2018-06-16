import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../shared/service/auth.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.css']
})
export class WordListComponent implements OnInit {
  wordNode: string;
  newWord: string;
  
  wordObserveble: Observable<any>

  constructor(private db: AngularFireDatabase, public authService: AuthService) { }

  ngOnInit() {
    this.wordNode = "words";
    this.getNewWordList();
  }

  onClickNewWord(){
    if(!this.newWord) return;
    this.db.list(this.wordNode).push(this.newWord);
    this.newWord = "";
    this.getNewWordList();
  }

  getNewWordList(){
    this.wordObserveble = this.db.list(this.wordNode).valueChanges();
    console.log(this.wordObserveble);
  }


}
