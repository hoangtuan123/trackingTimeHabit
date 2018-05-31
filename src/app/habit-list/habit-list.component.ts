import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import * as moment from 'moment';
import { AngularFireList } from 'angularfire2/database'
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'app-habit-list',
  templateUrl: './habit-list.component.html',
  styleUrls: ['./habit-list.component.css']
})
export class HabitListComponent implements OnInit {
  loggerList: AngularFireList<any>;
  habitObserveble: Observable<any>;

  habitList: Habit[];
  habits: Habit[];


  dateNow: Date;
  toDay: string;
  habitNode: string;
  loggerNode: string;

  constructor(private db: AngularFireDatabase, public authService: AuthService) {
    this.dateNow = new Date();

    this.habitNode = "habits";
    this.loggerNode = "loggers";

    this.toDay = moment(this.dateNow).format('YYYYMMDD');

    this.loggerList = this.db.list(this.loggerNode + '/' + this.toDay);
  }

  onChangeModel(habit) {
    habit.checked = !habit.checked;
    this.db.list(this.loggerNode).set(this.toDay, this.habitList);
  }

  updateToDayHabit() {

  }

  ngOnInit() {
    this.habitObserveble = this.getDataByNode(this.habitNode);

    this.getDataByNode(this.habitNode).subscribe(
      data => { this.habits = data },
      err => { }
    );
    this.getDataByNode(this.loggerNode + '/' + this.toDay).subscribe(
      data => this.proccessLogger(data),
      err => this.proccessError(err),
    )
  }

  getDataByNode(node): Observable<any[]> {
    return this.db.list(node).valueChanges();
  }

  proccessError(err) {
    console.log(err);
  }

  proccessLogger(data) {
    console.log(data);
    if (data && data.length) {
      this.habitList = data;
    }
    else {
      this.db.list(this.loggerNode).update(this.toDay, this.habits);
    }

  }
}


interface Habit {
  key: string;
  value: string;
  checked: boolean;
}