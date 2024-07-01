import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AutenticacaoService } from '../../servicos/autenticacao.service';
import { MensagemErroService } from '../../servicos/mensagem-erro.service';
import { LocalStorageService } from '../../servicos/local-storage.service';

@Component({
  selector: 'app-location-permission',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './location-permission.component.html',
  styleUrl: './location-permission.component.scss'
})
export class LocationPermissionComponent {

  faLock = faLock;
  utilizador:any;
  coordenadas:any;
  registrar$!:Observable<any>;
  constructor(private router: Router,private authService:AutenticacaoService,private erro:MensagemErroService, private localStore:LocalStorageService){}

  ngAfterViewInit(){
    try{
      this.utilizador = JSON.parse(String(this.localStore.getItem('user')))

    }catch(e){

    }

  }
  navegarLocationSelection() {
    // Navigate to the new route programmatically
    this.router.navigate(['/LocationSelection']);
  }
  navegarFeed() {
    // Navigate to the new route programmatically
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) =>{
      this.coordenadas=position.coords.latitude.toFixed(10) +', ' +position.coords.longitude.toFixed(10);
      this.utilizador.coordenadasMorada=this.coordenadas;
 
      this.registrar$=this.authService.registerClient(this.utilizador)

      this.registrar$.subscribe({
        next:(val=>{console.log(val); this.router.navigate(['/feed']);
        this.localStore.setItem('user',JSON.stringify(val));
        this.authService.setCookie('token',val.token)


        }),
        error:(err=>{
          console.log(err)
          this.erro.openErrorSnackBar("O email registrado já está em uso")

        })
      })
       
    });

   }
 

  

 
}
