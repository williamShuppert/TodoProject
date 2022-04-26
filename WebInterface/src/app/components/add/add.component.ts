import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  @ViewChild('input') inputRef!: ElementRef;
  @Input() placeholder: string = 'placeholder';
  @Output() onAdd = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  add() {
    const text = this.inputRef.nativeElement.value.trim();
    if (text.length > 0)
      this.onAdd.emit(this.inputRef.nativeElement.value);
  }

}
