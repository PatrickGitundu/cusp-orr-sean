import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

 ngAfterViewInit(): void {
  $('.collapsible').collapsible();
  $('nav').pushpin({
   top: 0,
   bottom: 1000,
   offset: 0
  });
 }
 constructor() { }
}
