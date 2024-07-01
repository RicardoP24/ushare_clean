import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../servicos/autenticacao.service';
import { Observable } from 'rxjs';
import { error } from 'console';
import { MensagemErroService } from '../../servicos/mensagem-erro.service';
import { LocalStorageService } from '../../servicos/local-storage.service';

interface Distrito {
  value: string;
  viewValue: string;
  municipios: Municipio[];
}

interface Municipio {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-location-selection',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, FontAwesomeModule, CommonModule],
  templateUrl: './location-selection.component.html',
  styleUrls: ['./location-selection.component.scss']
})
export class LocationSelectionComponent {

  faLock = faLock;
  dists$!: Observable<any>
  municipios$!: Observable<any>
  distritos: any[] = [];
  todosMunicipios: any[] = [];
  municipios: any[] = [];
  utilizador: any;
  municipioAtual!: string;
  distritoAtual!: string;



  constructor(private router: Router, private authService: AutenticacaoService,private erro:MensagemErroService, private localStore:LocalStorageService) { }

  ngAfterViewInit(): void {
    try {

      setTimeout(() => {
        console.log('entrou')
        this.iniciarTela()

      }, 300);
    } catch (e) {

    }
  }




  iniciarTela() {
    this.dists$ = this.authService.obterDistritos();
    this.municipios$ = this.authService.obterMunicipios();

    this.dists$.subscribe({
      next: (val) => { this.distritos = val; console.log(this.distritos) 

        this.municipios$.subscribe({
          next: (val) => { this.todosMunicipios = val;console.log(this.todosMunicipios)

            let userdata: string = this.localStore.getItem('user')!;
            console.log(userdata)
            let dados: any;
            if (userdata) {
              dados= JSON.parse(userdata)
              this.utilizador = dados
            }

            if (this.utilizador && this.utilizador.id_dist != 0) {
              
              let a=this.distritos.filter((val)=>val.id==this.utilizador.id_dist)[0];
              console.log(a,"aqui")
              this.distritoAtual=this.distritos.filter((val)=>val.id==this.utilizador.id_dist)[0].id;
              console.log(this.distritoAtual)
        
              this.municipios = this.todosMunicipios.filter((val) => val.id_dist == this.utilizador.id_dist);
              this.municipioAtual = this.todosMunicipios.filter((val) => val.id == this.utilizador.id_munic)[0].id
            }

          },
          error: (err) => { console.error(err) }
        });


      },
      error: (err) => { console.error(err) }
    })



  }


  navegarLocationPermission() {

    if(!this.distritoAtual || !this.municipioAtual){
      this.erro.openErrorSnackBar('Preencha todos os campos')
    }else{

      this.utilizador.id_dist=this.distritoAtual 
      this.utilizador.id_munic=this.municipioAtual
  
      this.localStore.setItem('user', JSON.stringify(this.utilizador))
  
      // Navigate to the new route programmatically
      this.router.navigate(['/locationpermision']);
    }

  }
  navegarUserInfo() {
    // Navigate to the new route programmatically
    this.router.navigate(['/registro/UserInfoRegistration']);
  }

  updateMunicipios(dist: any) {
    this.municipios = this.todosMunicipios.filter((val) => val.id_dist == dist)
  }

}