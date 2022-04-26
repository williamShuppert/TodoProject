import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ITodoList } from 'src/app/interfaces/todo-list';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
  @ViewChild('edit') editInput!: ElementRef;
  @Input() listInfo!: ITodoList;

  @Output() onDelete = new EventEmitter<number>();

  editing = false;
  deleting = false;

  constructor(private todoService: TodoService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  delete() {
    if (!this.editing && this.deleting)
      this.onDelete.emit(this.listInfo.id);

  }

  saveEdits() {
    if (this.editInput.nativeElement.value.length == 0)
      return;

    this.listInfo.name = this.editInput.nativeElement.value;
    this.todoService.updateList(this.listInfo.name, this.listInfo.id);

    this.editing = false;
  }

  enableEditing() {
    this.editing = true;
    this.changeDetector.detectChanges();
    this.editInput.nativeElement.value = this.listInfo.name;
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

}
