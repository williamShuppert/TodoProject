import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITodoList } from 'src/app/interfaces/todo-list';
import { ITodoListItem } from 'src/app/interfaces/todo-list-item';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {
  public listInfo!: ITodoList;

  public items: ITodoListItem[] = [];

  constructor(private route: ActivatedRoute, private todoService: TodoService) {}
  
  ngOnInit() {
    this.listInfo = {
      id: parseInt(this.route.snapshot.paramMap.get('id')!),
      ownerId: -1,
      name: ''
    }

    this.todoService.getListItems(this.listInfo.id).then(items => {
      this.items = items;
    });

    this.todoService.getList(this.listInfo.id).then(list => {
      this.listInfo = list;
    });
  }

  addItem(content: string) {
    this.todoService.addListItem(this.listInfo.id, content).then(id => {
      this.items.push({
        id,
        listId: this.listInfo.id,
        content,
        isComplete: false
      })
    })
  }

  deleteItem(id: number) {
    this.todoService.deleteListItem(this.listInfo.id, id).then(() => {
      this.items = this.items.filter(e => e.id !== id);
    });
  }
}
