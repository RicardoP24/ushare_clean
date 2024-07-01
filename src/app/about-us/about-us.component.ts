import { Component, ElementRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { PerfilComponent } from '../feed/perfil/perfil.component';
import { SearchComponent } from '../feed/search/search.component';
import { ComentariosComponent } from '../feed/comentarios/comentarios.component';
import { ArtigosPopupComponent } from '../feed/artigos-popup/artigos-popup.component';
import { PopupPComponent } from '../feed/popup-p/popup-p.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  faRss = faRss;
  faArtigo = faClipboardList;
  faHamb = faBars;
  faAboutUs = faPeopleGroup;

  constructor(private router: Router,private subbtn: MatDialog, private artbtn: MatDialog, private coment: MatDialog, private search: MatDialog, private perfil: MatDialog) {

  }


  openFeed(){
    this.router.navigate(['/feed'])
  }
  handleSendClick() {
    console.log('send icon clicked');
  }

  handleAttachClick() {
    console.log('Attach icon clicked');
  }

  handleSearchClick() {

    console.log('Search icon clicked');
  }

  handleChatClick() {

    console.log('Chat icon clicked');
  }

  handleLogoutClick() {

    console.log('Logout icon clicked');
  }

  @ViewChild('mySidenav') sidenav!: ElementRef;

  closeNav() {
    this.sidenav.nativeElement.style.width = '0';
  }

  openNav() {
    this.sidenav.nativeElement.style.width = '250px';
  }

  openperfil() {
    this.perfil.open(PerfilComponent)
  }

  opensearch() {
    this.search.open(SearchComponent);
  }

  opencoment() {
    this.coment.open(ComentariosComponent);
  }

  openartg() {
    this.artbtn.open(ArtigosPopupComponent);
  }

  opensubbtn() {
    this.subbtn.open(PopupPComponent);
  }

}
