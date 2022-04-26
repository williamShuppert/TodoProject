import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ITodoListItem } from 'src/app/interfaces/todo-list-item';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit, AfterViewInit {

  @Input() itemInfo!: ITodoListItem;
  @ViewChild('edit') editInput!: ElementRef;
  @ViewChild('complete') completeInput!: ElementRef;

  @Output() onDelete = new EventEmitter<number>();

  editing = false;
  deleting = false;

  constructor(private todoService: TodoService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.completeInput.nativeElement.checked = this.itemInfo.isComplete;
  }

  completeTodo() {
    this.itemInfo.isComplete = !this.itemInfo.isComplete;
  }

  
  delete() {
    if (!this.editing && this.deleting)
      this.onDelete.emit(this.itemInfo.id);

  }

  saveEdits() {
    if (this.editInput.nativeElement.value.length == 0)
      return;

    this.itemInfo.content = this.editInput.nativeElement.value;
    this.todoService.updateListItem(this.itemInfo);

    this.editing = false;
  }

  enableEditing() {
    this.editing = true;
    this.changeDetector.detectChanges();
    this.editInput.nativeElement.value = this.itemInfo.content;
    this.editInput.nativeElement.focus();
  }

  primary() {
    if (this.deleting) this.delete();
    else if (this.editing) this.saveEdits();
    else this.enableEditing();
  }

  secondary() {
    if (this.deleting) this.deleting = false;
    else if (this.editing) this.editing = false;
    else this.deleting = true;
  }

  toggleCompleted() {
    this.itemInfo.isComplete = !this.itemInfo.isComplete;
    this.todoService.updateListItem(this.itemInfo).catch(() => {
      this.itemInfo.isComplete = !this.itemInfo.isComplete;
      this.completeInput.nativeElement.checked = this.itemInfo.isComplete;
    });
  }
}
