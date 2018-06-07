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
  daySelected: string;
  habitNode: string;
  loggerNode: string;

  days: any [] = [];
  FORMAT_DATE = "YYYYMMDD";

  constructor(private db: AngularFireDatabase, public authService: AuthService) {
    this.dateNow = new Date();

    this.habitNode = "habits";
    this.loggerNode = "loggers";

    this.daySelected = moment(this.dateNow).format(this.FORMAT_DATE);
    for(const item of [0,1,2,3,4,5,6,7]){
      const date = moment(this.dateNow).subtract(item, 'days');
      this.days.push({
        date,
        dateFormat: date.format(this.FORMAT_DATE),
        dateString: date.format("LL"),
        checked: (date.format(this.FORMAT_DATE) == this.daySelected ? true : false)
      });
    }
  }

  getLoggerList(day){
    this.loggerList = this.db.list(this.loggerNode + '/' + day);

    this.habitObserveble = this.getDataByNode(this.habitNode);

    this.getDataByNode(this.habitNode).subscribe(
      data => { this.habits = data },
      err => { }
    );
    this.getDataByNode(this.loggerNode + '/' + day).subscribe(
      data => this.proccessLogger(data, day),
      err => this.proccessError(err),
    )
  }

  onChangeModel(habit) {
    console.log('log habits', habit);
    habit.checked = !habit.checked;
    this.db.list(this.loggerNode).set(this.daySelected, this.habitList);
  }

  onClickChoiceDay(day){
    this.days.forEach(item => item.checked = false);
    day.checked = true;
    this.daySelected = day.dateFormat;
    this.getLoggerList(day.dateFormat);
  }

  ngOnInit() {
    this.getLoggerList(this.daySelected);
  }

  getDataByNode(node): Observable<any[]> {
    return this.db.list(node).valueChanges();
  }

  proccessError(err) {
    console.log(err);
  }

  proccessLogger(data, day) {
    console.log(data);
    if (data && data.length) {
      this.habitList = data;
    }
    else {
      this.db.list(this.loggerNode).update(day, this.habits);
    }
  }
}


interface Habit {
  key: string;
  value: string;
  checked: boolean;
}