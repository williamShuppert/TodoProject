import { Component, OnInit } from '@angular/core';
import { ITodoList } from 'src/app/interfaces/todo-list';
import { AuthService } from 'src/app/services/auth.service';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  lists: ITodoList[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.getLists().then(lists => {
      this.lists = lists;
    });
  }

  addList(name: string) {
    this.todoService.addList(name).then(res => {
      this.lists.push({ name, id: res.id, ownerId: res.ownerId });

    }).catch(err => {
      console.log(err.message)
    });
  }

  deleteList(id: number) {
    this.todoService.deleteList(id).then(() => {
      this.lists = this.lists.filter(e => e.id !== id);
    })
  }

}
