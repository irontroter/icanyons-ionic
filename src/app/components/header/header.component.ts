import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() backButton: boolean;
  @Input() returnButton ? = false;
  @Output() clickSubmite = new EventEmitter();

  submite = false;

  constructor() { }
  onClick() {
  this.submite = true;
  this.clickSubmite.emit(this.submite);
  }

  ngOnInit() {}

}
