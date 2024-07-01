import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { MatDialogModule } from '@angular/material/dialog'
import { MatDialog } from '@angular/material/dialog';
import { PopupPComponent } from './popup-p/popup-p.component';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { ArtigosPopupComponent } from './artigos-popup/artigos-popup.component';
import { InterresadosComponent } from './interresados/interresados.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { SearchComponent } from './search/search.component';
import { PerfilComponent } from './perfil/perfil.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../servicos/local-storage.service';
import { stringify } from 'querystring';
import { PostsService } from '../servicos/posts.service';
import { Observable } from 'rxjs';
import { GetsService } from '../servicos/gets.service';


@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [FontAwesomeModule, MatDialogModule, CommonModule, ChatboxComponent, ArtigosPopupComponent, InterresadosComponent, ComentariosComponent, SearchComponent, PerfilComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {

  isFeedActive: boolean = true;
  chatParams: any = {
    id_user: 0,
    id_user2: 0,
    nome_user2: ''
  };
  faPeopleGroup = faPeopleGroup;
  faRss = faRss;
  faMagnifyingGlass = faMagnifyingGlass;
  faMessage = faMessage;
  faRightFromBracket = faRightFromBracket;
  faPaperPlane = faPaperPlane;
  faPaperclip = faPaperclip;
  faArtigo = faClipboardList
  faHamb = faBars
  faAboutUs = faPeopleGroup;
  anuncio = ''

  dadosUtilizador: any = {
    id: '',
    id_dist: '',
    id_munic: '',
    nome: '',
    coordenadasmorada: '',
    email: '',
    nif: '',
    tipouser: ''


  };

  @ViewChild('mySidenav') sidenav!: ElementRef;
  @ViewChild('interessados') interessados!: ElementRef;
  @ViewChild('interessados') interessadosComponent!: InterresadosComponent;
  @ViewChild('meusartigosfriends') meusArt!: ElementRef;
  @ViewChild('publicacoes') pubs!: ElementRef;
  @ViewChild('eventos') eventos!: ElementRef;
  @ViewChild('chatboxRef') chatboxRef!: ChatboxComponent;

  posts: any[] = []
  events: any[] = []
  conexoes: any[] = []
  interess: any[] = []

  activeSection: string = 'publicacoes';

  constructor(private getServ: GetsService, private localStore: LocalStorageService, private router: Router, private subbtn: MatDialog, private artbtn: MatDialog, private coment: MatDialog, private search: MatDialog, private perfil: MatDialog) {

    this.postCreationDate = new Date("2024-01-05T22:05:00");


  }

  ngAfterViewInit(): void {
    setTimeout(() => {

      let userdata: string = this.localStore.getItem('user')!;
      if (userdata) {


        let dados: any = JSON.parse(userdata)
        console.log(dados)

        this.dadosUtilizador = {
          nome: dados.nome,
          id: dados.id,
          id_dist: dados.id_dist,
          id_munic: dados.id_munic,
          coordenadasmorada: dados.coordenadasmorada,
          email: dados.email,
          nif: dados.nif,
          tipouser: dados.tipouser
        }

        this.chatParams = {
          id_user: this.dadosUtilizador.id,

        }

        this.obterConexoes()

        this.getPosts()
        this.getEventos()
      }


    }, 100);
  }

  logout() {
    this.localStore.deleteCookies()
    this.router.navigate(['login'])
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth <= 1000) {
      this.setActiveSection(this.activeSection)
    } else {
      this.displayAllSections();
    }
  }


  verInteressados(post: any) {

    let resp$: Observable<any> = this.getServ.obterInteressadosAnuncio(post.id);

    resp$.subscribe({
      next: (val) => {

        this.interess = val;
        
        setTimeout(() => {
        this.interessadosComponent.fetchdata();
      }, 100);
          (document.getElementById('interessados-popup') as HTMLElement).style.display = 'block';

        this.subbtn.closeAll();
      },
      error: (err) => {
        (document.getElementById('interessados-popup') as HTMLElement).style.display = 'block';

        this.subbtn.closeAll();
        console.error(err)
      }
    });



  }

  obterConexoes() {
    let conex$: Observable<any> = this.getServ.obterConexoes(this.dadosUtilizador.id)

    conex$.subscribe({
      next: (conex) => {
        this.conexoes = conex;
        console.log(conex)
      },

      error: (error) => {
        console.error(error)
      }

    })
  }

  getPosts() {
    let userdata = String(this.localStore.getItem('user'))
    if (userdata) {

      let data = JSON.parse(userdata)

      console.log(data)
      let anuncios$ = this.getServ.verAnunciosDoMunicipio(data.id_munic)
      anuncios$.subscribe(
        {
          next: (val) => {

            this.posts = val
            let i = 0;

            for (let post of this.posts) {

              let autores$: Observable<any> = this.getServ.obterAutor(post.id_user)
              autores$.subscribe({
                next: (autor) => {

                  console.log(autor)


                  let nome: string = autor[0].nome;
                  let id: number = autor[0].id;
                  let id_dist: number = autor[0].id_dist;
                  let id_munic: number = autor[0].id_munic;
                  let coordenadasmorada: string = autor[0].coordenadasmorada;
                  let email: string = autor[0].email;
                  let nif: string = autor[0].nif;
                  let tipouser: string = autor[0].tipouser;


                  this.posts[i] = {
                    ...this.posts[i], nomeAutor: nome,
                    meuId: this.dadosUtilizador.id,
                    idAutor: id,
                    id_distAutor: id_dist,
                    id_municAutor: id_munic,
                    coordenadasmoradaAutor: coordenadasmorada,
                    emailAutor: email,
                    nifAutor: nif,
                    tipoUserAutor: tipouser,
                    meuPost: this.dadosUtilizador.id == id

                  }
                  i++;

                  console.log(this.posts)

                },

                error: (err) => {
                  console.error(err)
                }
              })

            }

            console.log(val)

          },

          error: (err) => {

            console.log(err)

          }
        }
      )
    }
  }


  getEventos() {
    let userdata = String(this.localStore.getItem('user'))
    if (userdata) {

      let data = JSON.parse(userdata)

      console.log(data)
      let anuncios$ = this.getServ.verEventosDoMunicipio(data.id_munic)
      anuncios$.subscribe(
        {
          next: (val) => {

            this.events = val
            let i = 0;

            for (let event of this.events) {

              let autores$: Observable<any> = this.getServ.obterAutor(event.id_user)
              autores$.subscribe({
                next: (autor) => {

                  let nome: string = autor[0].nome;
                  let id: number = autor[0].id;
                  let id_dist: number = autor[0].id_dist;
                  let id_munic: number = autor[0].id_munic;
                  let coordenadasmorada: string = autor[0].coordenadasmorada;
                  let email: string = autor[0].email;
                  let nif: string = autor[0].nif;
                  let tipouser: string = autor[0].tipouser;


                  this.events[i] = {
                    ...this.events[i], nomeAutor: nome,
                    meuId: this.dadosUtilizador.id,
                    idAutor: id,
                    id_distAutor: id_dist,
                    id_municAutor: id_munic,
                    coordenadasmoradaAutor: coordenadasmorada,
                    emailAutor: email,
                    nifAutor: nif,
                    tipoUserAutor: tipouser,
                    meuPost: this.dadosUtilizador.id == id

                  }
                  i++;


                },

                error: (err) => {
                  console.error(err)
                }
              })

            }


            console.log(this.events, "kkkk")

          },

          error: (err) => {

            console.log(err)

          }
        }
      )
    }
  }


  displayAllSections() {
    this.meusArt.nativeElement.style.display = 'flex';
    this.pubs.nativeElement.style.display = 'block';
    this.eventos.nativeElement.style.display = 'block';
  }

  openAboutUs() {
    this.router.navigate(['/aboutUs'])

  }
  setActiveSection(activeSec: string) {

    this.activeSection = activeSec;

    console.log(activeSec)

    switch (this.activeSection) {

      case 'meusartigos-friends':
        this.meusArt.nativeElement.style.display = 'flex';
        this.pubs.nativeElement.style.display = 'none';
        this.eventos.nativeElement.style.display = 'none';
        break;

      case 'publicacoes':
        this.meusArt.nativeElement.style.display = 'none';
        this.pubs.nativeElement.style.display = 'block';
        this.eventos.nativeElement.style.display = 'none';
        break;

      case 'eventos':
        this.meusArt.nativeElement.style.display = 'none';
        this.pubs.nativeElement.style.display = 'none';
        this.eventos.nativeElement.style.display = 'block';
        break;

      default:
        break;
    }

  }

  showSection(section: string) {
    this.activeSection = section;
  }

  contatarProprietario(data: any) {

    this.chatParams = {
      ...this.chatParams,
      id_user2: data.id_user,
      nome_user2: data.nomeAutor,
      id_anuncio:data.id?data.id:-1
    }

    setTimeout(() => {
      this.chatboxRef.toggleChatbox()

    }, 100);


  }


  openNav() {
    this.sidenav.nativeElement.style.width = '250px';
  }

  closeNav() {
    this.sidenav.nativeElement.style.width = '0';
  }

  @Input() postCreationDate: Date;



  openperfil(post: any, evento: any) {
    this.perfil.open(PerfilComponent, {
      data: { post, evento }
    })
  }

  opensearch() {
    this.search.open(SearchComponent);
  }

  opencoment(post: any) {
    this.coment.open(ComentariosComponent, {
      data: post
    });
  }

  openartg(post: any, evento: any) {
    this.artbtn.open(ArtigosPopupComponent, {
      data: { post, evento },


    });
  }

  opensubbtn() {
    this.subbtn.open(PopupPComponent);
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

  toggleFeed() {
    this.isFeedActive = true;
    console.log("Feed is active");
  }

  toggleArtigos() {
    this.isFeedActive = false;
    console.log("Artigos are active");
  }


}