import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../servicos/autenticacao.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode library for decoding JWT tokens
import { MensagemErroService } from '../../servicos/mensagem-erro.service';
import { LocalStorageService } from '../../servicos/local-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  dadosUtilizador:any={
    nome:'',
    id:'',
    id_dist:'',
    id_munic:'',
    coordenadasmorada:'',
    email:'',
    nif:'',
    tipouser:''
  }

  constructor(private router: Router, private authService: AutenticacaoService, private erro: MensagemErroService, private localStore:LocalStorageService) { }

  navegarRegistro() {
    // Navigate to the new route programmatically
    this.router.navigate(['/registro']);

  }



  // Function to redirect to the user page if the token is valid
  public redirectToUserPageIfValid(): void {

    let res$: Observable<any> = this.authService.loginJWT()

    res$.subscribe({
      next: (user) => {

        //this.localStore.setItem('user',user.id)
        this.router.navigate(['/feed']); // Navigate to the user page

      },
      error: (err) => {

        console.error(err)
      }
    })

  }
  ngAfterViewInit(): void {

    if (this.authService.getCookie('token'))
      this.redirectToUserPageIfValid()

  }


  token$!: Observable<any>;

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  login(): void {
    if (this.email=='' || this.password=='') {
      this.erro.openErrorSnackBar("Preencha todos os campos")

      return;
    }
    if (!this.isValidEmail(this.email)) {
      this.erro.openErrorSnackBar("Formato do email incorreto")

      return;
    }
    this.token$ = this.authService.login(this.email, this.password);

    this.token$.subscribe({
      next: (value) => {

        this.dadosUtilizador={
          nome:value.user.nome,
          id:value.user.id,
          id_dist:value.user.id_dist,
          id_munic:value.user.id_munic,
          coordenadasmorada:value.user.coordenadasmorada,
          email:value.user.email,
          nif:value.user.nif,
          tipouser:value.user.tipouser
        }
        console.log(this.dadosUtilizador)
        this.localStore.setItem('user',JSON.stringify(this.dadosUtilizador))


        console.log('Observable emitted the next value: ', value)
        this.authService.setCookie('token', value.token)
        this.router.navigate(['/feed']);

      },
      error: err => {
        this.erro.openErrorSnackBar(err.error.message)
      }
    });
  }
}
