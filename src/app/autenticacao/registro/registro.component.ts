import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacaoService } from '../../servicos/autenticacao.service';
import { FormsModule } from '@angular/forms';
import { MensagemErroService } from '../../servicos/mensagem-erro.service';
import { LocalStorageService } from '../../servicos/local-storage.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent implements AfterViewInit {

  email: string = '';
  password: string = '';
  passwordConfirm: String = ''
  registro$!: Observable<String>;
  usuario: any = {
    "nome": "",
    "nif": 0,
    "tipoUser": "",
    "email": "",
    "password": "",
    "coordenadasMorada": "",
    "id_dist": 0,
    "id_munic": 0

  };


  constructor(private router: Router, private erro: MensagemErroService, private localStore: LocalStorageService) { }

  navegarLogin() {
    // Navigate to the new route programmatically
    this.router.navigate(['/login']);
  }

  ngAfterViewInit(): void {
    try {
      setTimeout(() => {

        let userdata: string = this.localStore.getItem('user')!;
        if (userdata) {


          let dados: any = JSON.parse(userdata)
          this.email = JSON.parse(dados).email

        }
      }, 100);
    } catch (e) {
    }
  }


  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }




  registrarEmailEPass(): void {





    if (this.password == this.passwordConfirm && this.password != '' && this.passwordConfirm != '') {

      this.usuario.email = this.email;
      this.usuario.password = this.password;

      this.localStore.setItem('user', JSON.stringify(this.usuario))

      this.router.navigate(['/registro/UserInfoRegistration']);

    }

    if (this.password == '' || this.email == '') {

      this.erro.openErrorSnackBar('Preencha todos os campos')

    }
    if (!this.isValidEmail(this.email)) {
      this.erro.openErrorSnackBar("Formato do email incorreto")

    }
    if (this.password != this.passwordConfirm) {
      this.erro.openErrorSnackBar('Palavras passe não coincidem')

    }

  }


}
