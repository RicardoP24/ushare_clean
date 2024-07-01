import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MensagemErroService } from '../../servicos/mensagem-erro.service';
import { LocalStorageService } from '../../servicos/local-storage.service';


interface Usuario {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-user-info-registration',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './user-info-registration.component.html',
  styleUrl: './user-info-registration.component.scss'
})
export class UserInfoRegistrationComponent {

  usuarios: Usuario[] = [
    { value: 'singular-0', viewValue: 'Singular' },
    { value: 'org-1', viewValue: 'Organização' },
  ];

  nome!: string;
  nif!: number;
  tipoUser!: string;

  utilizador!: any

  constructor(private router: Router,private erro:MensagemErroService, private localStore:LocalStorageService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      
      try {

        let userdata: string = this.localStore.getItem('user')!;
        console.log(userdata)
        let dados: any;
        if (userdata) {
          dados= JSON.parse(userdata)
          this.utilizador = dados
        }

        console.log(this.utilizador)
        if (this.utilizador.nome!='')
          this.nome = this.utilizador.nome;
        if (this.utilizador.nif != 0)
          this.nif = this.utilizador.nif;
        if (this.utilizador.tipoUser)
          this.tipoUser = this.utilizador.tipoUser
  
      } catch (e) {
      }
    }, 100);
  }

  navegarLocationSelection() {
    // Navigate to the new route programmatically
    this.router.navigate(['/LocationSelection']);
  }
  navegarRegistro() {
    // Navigate to the new route programmatically
    this.router.navigate(['/registro']);
  }

  validaContribuinte(contribuinte: string): boolean {
    let temErro = 0;

    if (
      contribuinte.substr(0, 1) != '1' && // pessoa singular
      contribuinte.substr(0, 1) != '2' && // pessoa singular
      contribuinte.substr(0, 1) != '3' && // pessoa singular
      contribuinte.substr(0, 2) != '45' && // pessoa singular não residente
      contribuinte.substr(0, 1) != '5' && // pessoa colectiva
      contribuinte.substr(0, 1) != '6' && // administração pública
      contribuinte.substr(0, 2) != '70' && // herança indivisa
      contribuinte.substr(0, 2) != '71' && // pessoa colectiva não residente
      contribuinte.substr(0, 2) != '72' && // fundos de investimento
      contribuinte.substr(0, 2) != '77' && // atribuição oficiosa
      contribuinte.substr(0, 2) != '79' && // regime excepcional
      contribuinte.substr(0, 1) != '8' && // empresário em nome individual (extinto)
      contribuinte.substr(0, 2) != '90' && // condominios e sociedades irregulares
      contribuinte.substr(0, 2) != '91' && // condominios e sociedades irregulares
      contribuinte.substr(0, 2) != '98' && // não residentes
      contribuinte.substr(0, 2) != '99' // sociedades civis
    ) {
      temErro = 1;
    }

    const check1 = parseInt(contribuinte.substr(0, 1)) * 9;
    const check2 = parseInt(contribuinte.substr(1, 1)) * 8;
    const check3 = parseInt(contribuinte.substr(2, 1)) * 7;
    const check4 = parseInt(contribuinte.substr(3, 1)) * 6;
    const check5 = parseInt(contribuinte.substr(4, 1)) * 5;
    const check6 = parseInt(contribuinte.substr(5, 1)) * 4;
    const check7 = parseInt(contribuinte.substr(6, 1)) * 3;
    const check8 = parseInt(contribuinte.substr(7, 1)) * 2;

    const total =
      check1 + check2 + check3 + check4 + check5 + check6 + check7 + check8;
    const divisao: number = total / 11;
    console.log(divisao)
    const modulo11 = total - parseInt(String(divisao)) * 11;
    let comparador = 0;
    if (modulo11 == 1 || modulo11 == 0) {
      comparador = 0;
    } else {
      comparador = 11 - modulo11;
    }

    const ultimoDigito = parseInt(contribuinte.substr(8, 1));
    if (ultimoDigito != comparador) {
      temErro = 1;
    }

    if (temErro == 1) {
      return false;
    }

    return true;
  }

  
  loginUserInfo(): void {

    console.log(this.nif)

    if (this.nif && this.nome != '' && this.tipoUser) {

      this.utilizador.nome = this.nome
      this.utilizador.nif = this.nif
      this.utilizador.tipoUser = this.tipoUser

      if (!this.validaContribuinte(String(this.nif))) {
        this.erro.openErrorSnackBar("Formato do nif incorreto")
        return;
      }


      this.localStore.setItem('user', JSON.stringify(this.utilizador))

      this.router.navigate(['/LocationSelection']);

    } else if(this.nome=='' || !this.nif || !this.tipoUser) {

      this.erro.openErrorSnackBar('Preencha todos os campos')

    }

  }
}
