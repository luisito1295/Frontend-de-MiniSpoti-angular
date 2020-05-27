import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public titulo:string;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
  ) {
    this.titulo = 'Home';

  }

  ngOnInit(): void {
  }
}
