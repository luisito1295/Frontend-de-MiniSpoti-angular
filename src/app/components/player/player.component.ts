import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../../services/global';
import { Song } from '../../models/song';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  public url;
  public song:Song;

  constructor() {
    this.url = GLOBAL.url;
  }

  ngOnInit() {

    var song = JSON.parse(localStorage.getItem('sound_song'));

    if(song){
      this.song = song;
    }else{
      this.song = new Song(1,'','','','');
    }

  }

}
