import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { HomeComponent } from './components/home/home.component';
import { ArtistAddComponent } from './components/artist-add/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail/artist-detail.component';
import { AlbumAddComponent } from './components/album-add/album-add.component';
import { AlbumEditComponent } from './components/album-add/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';

//Guards
import { AdminGuard } from './guards/admin.guard';
import { SongAddComponent } from './components/song-add/song-add.component';
import { SongEditComponent } from './components/song-add/song-edit.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'artistas/:page', component: ArtistListComponent},
  {path: 'crear-artista', component: ArtistAddComponent, canActivate: [AdminGuard]},
  {path: 'editar-artista/:id', component: ArtistEditComponent},
  {path: 'artista/:id', component: ArtistDetailComponent},
  {path: 'crear-album/:artist', component: AlbumAddComponent},
  {path: 'editar-album/:id', component: AlbumEditComponent},
  {path: 'album/:id', component: AlbumDetailComponent},
  {path: 'crear-tema/:album', component: SongAddComponent},
  {path: 'editar-tema/:id', component: SongEditComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: '**', component: HomeComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
