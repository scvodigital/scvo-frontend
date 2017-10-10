import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent implements OnInit {

  constructor() {
    console.log('TEST COMPONENT');
  }

  ngOnInit() {
  }

}
