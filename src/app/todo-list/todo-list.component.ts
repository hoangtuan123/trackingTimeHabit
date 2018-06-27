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


  constructor(private db: AngularFireDatabase
    , public authService: AuthService
  ) {
    this.todoNode = "todos";
    this.todoInput = "";
    this.todoListRef = db.list(this.todoNode, ref => ref.orderByKey());
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
    const obj = { value: this.todoInput, checked: false };
    this.todoListRef.push(obj);
    this.todoInput = "";
  }

  updateTodo(key, todo){
    const newValue = { value: todo.value, checked: !todo.checked };
    this.todoListRef.update(key, newValue);
  }

  removeTodo(key){
    this.todoListRef.remove(key);
  }

  clickAddTodo(){
    if(this.todoInput)
      this.addNewTodo();
  }

  clickUpdateTodo(key, todo){
    this.updateTodo(key, todo);
  }

  clickRemoveTodo(key){
    this.removeTodo(key);
  }

}
