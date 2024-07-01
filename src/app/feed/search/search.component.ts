import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComentariosComponent } from '../comentarios/comentarios.component'
import { GetsService } from '../../servicos/gets.service';
import { LocalStorageService } from '../../servicos/local-storage.service';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { subscribe } from 'diagnostics_channel';
import { error } from 'console';
import { MensagemErroService } from '../../servicos/mensagem-erro.service';

interface Distance {
  value: number;
  viewValue: string;
}

interface TipoAnuncio {
  value: string;
  viewValue: string;
}

interface Estado {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})


export class SearchComponent implements OnInit {


  dadosUtilizador: any = {}
  todosOsPosts: any[] = []
  autores: any[] = []

  postsFiltrados: any[] = []
  @ViewChild('pesquisa') textoPesquisa!: ElementRef;
  @ViewChild('tipoanuncio') tipoAnuncio!: MatSelect;
  @ViewChild('distancia') distance!: MatSelect;

  distances: Distance[] = [
    { value: 5, viewValue: '5 km' },
    { value: 10, viewValue: '10 km' },
    { value: 15, viewValue: '15 km' },
    { value: 20, viewValue: '20 km' },
    { value: 25, viewValue: '25 km' },
    { value: 30, viewValue: '30 km' },
  ];


  tipoAnuncios: TipoAnuncio[] = [
    { value: "Alerta", viewValue: 'Alerta' },
    { value: 'Disponibilização de artigo', viewValue: 'Disponibilização de artigo' },
    { value: 'Solicitação de artigo', viewValue: 'Solicitação de artigo' },
    { value: 'Evento', viewValue: 'Evento' }
  ];



  

  searchQuery: string = "";


  constructor(private mensagemErro: MensagemErroService, private localStore: LocalStorageService, private fecha: MatDialog, private comentarios: MatDialog, private getS: GetsService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

    setTimeout(() => {

      let userdata: string = this.localStore.getItem('user')!;
      if (userdata) {


        let dados: any = JSON.parse(userdata)

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

      }

      this.obterAnuncios()
    }, 100);

  }

  checkFields(): boolean {
    const textoPesquisa = this.textoPesquisa.nativeElement.value;
    const tipoAnuncio = this.tipoAnuncio.value;
    const distance = this.distance.value;

    if (textoPesquisa && tipoAnuncio && distance) {
      return true;
    } else {
      return false;
    }
  }

  obterAnuncios() {
    let posts$: Observable<any> = this.getS.obterPostsPesquisa(this.dadosUtilizador.id_munic)

    posts$.subscribe({
      next: (val) => {
        this.todosOsPosts = val;
        console.log(val)
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  search() {
    
    this.filtrarPosts()
 
  }

   


  filtrarPosts() {


    if (this.checkFields()) {
      let txt = this.textoPesquisa.nativeElement.value;

      let coords: string[] = this.dadosUtilizador.coordenadasmorada.split(',')

      const mylatitude: number = Number(coords[0])
      const mylongitude: number = Number(coords[1])
      this.postsFiltrados=[]

      this.todosOsPosts.forEach((element) => {
        let autor$ = this.getS.obterAutor(element.id_user)
        autor$.subscribe({
          next: (autor) => {

            let coords: string[] = autor[0].coordenadasmorada.split(',')

            const latitude: number = Number(coords[0])
            const longitude: number = Number(coords[1])

            console.log(this.calculateDistance({ latitude: mylatitude, longitude: mylongitude }, { latitude, longitude }) )

            const condition: boolean = (autor[0].nome.includes(txt) || element.titulo.includes(txt) || element.descricao.includes(txt)) &&
              this.calculateDistance({ latitude: mylatitude, longitude: mylongitude }, { latitude, longitude }) <= this.distance.value &&
              this.tipoAnuncio.value == element.tipoanuncio

              console.log(condition)


            if (condition){

              this.postsFiltrados.push({...autor[0],...element})
            }




          },

          error: (err) => {
            console.error(err)
          }
        })
      })
 


    } else {
      this.mensagemErro.openErrorSnackBar('Preencha todos os campos!')
    }
  }

  calculateDistance(coords1: { latitude: number, longitude: number }, coords2: { latitude: number, longitude: number }): number {
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = coords1.latitude;
    const lon1 = coords1.longitude;
    const lat2 = coords2.latitude;
    const lon2 = coords2.longitude;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance;
  }


  close() {
    this.fecha.closeAll();

  }




  openChat() {
    (document.getElementById('sideChatBox') as HTMLElement).style.display = 'block';
    this.fecha.closeAll();

  }
  openComentarios() {
    this.fecha.closeAll();
    this.comentarios.open(ComentariosComponent)

  }
}
