import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { AuthService } from '../shared/service/auth.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todoNode: string;
  todoListObservable: Observable<any>;
  todoListRef: AngularFireList<any>;
  todoInput: string;
  fromDate: string;
  toDate:string;
  priorityTodo: string;
  
  
  constructor(private db: AngularFireDatabase
    , public authService: AuthService
  ) {
    this.todoNode = "todos";
    this.todoInput = "";
    this.todoListRef = db.list(this.todoNode, ref => ref.orderByKey());
  }

  clickAddPriority(value){
    this.priorityTodo = value;
  }

  getTimeNow(){
    return new Date().getTime();
  }

  viewPercentProgessBar(todo){
    const rs = (this.getTimeNow() - todo.fromdateTime) / (todo.todateTime - todo.fromdateTime);
    return Math.floor(rs * 100);
  }

  ngOnInit() {
    this.getTodoList();
  }

  getTodoList(){
    this.todoListObservable = this.todoListRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  addNewTodo(){
    const obj = { 
      value: this.todoInput, 
      checked: false, 
      fromdate: this.fromDate, 
      todate: this.toDate, 
      fromdateTime: this.getTime(this.fromDate), 
      todateTime: this.getTime(this.toDate) ,
      priorityTodo: this.priorityTodo
    };
    this.todoListRef.push(obj);
    this.todoInput = "";
  }

  getTime(date){
    return new Date(date.year + '-' + date.month + '-' + date.day).getTime();
  }

  updateTodo(key, todo){
    const newValue = { value: todo.value, checked: !todo.checked };
    this.todoListRef.update(key, newValue);
  }

  removeTodo(key){
    this.todoListRef.remove(key);
  }

  clickAddTodo(){
    if(this.todoInput && this.fromDate && this.toDate && this.priorityTodo)
      this.addNewTodo();
  }

  clickUpdateTodo(key, todo){
    this.updateTodo(key, todo);
  }

  clickRemoveTodo(key){
    this.removeTodo(key);
  }

}
