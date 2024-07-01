import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { GetsService } from '../../servicos/gets.service';
import { PostsService } from '../../servicos/posts.service';
import { Observable, min } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.scss'
})
export class ChatboxComponent {
  showChatbox: boolean = false;
  @Input('chatParams') chatParams!: any;
  @ViewChild('mensagem') mensagem!: ElementRef;
  mensagens:any[]=[]
  minhasMsn:any[]=[]
  outraMsn:any[]=[]

  constructor(private getS: GetsService, private postServ: PostsService) {

  }

  ngAfterViewInit() {

  }

  enviarMensagem() {
    if (this.checkFields()) {
      let data={
        id_user: this.chatParams.id_user,
        id_user2: this.chatParams.id_user2,
        mensagem: this.mensagem.nativeElement.value,
        id_anuncio:this.chatParams.id_anuncio
      }

      let response$: Observable<any> = this.postServ.enviarMensagem(data)

      response$.subscribe({
        next: (val) => {
          this.mensagem.nativeElement.value=''
          this.receberMensagens()
        },
        error: (err) => {
          console.log(err)

        }
      })
    }
  }

  receberMensagens(){
    let mensagens$:Observable<any> = this.getS.obterMensagens(this.chatParams.id_user,this.chatParams.id_user2)

    mensagens$.subscribe({
      next:(val)=>{
        this.mensagens=val

        this.minhasMsn=this.mensagens.filter((msn)=>msn.id_user1==this.chatParams.id_user)
        this.outraMsn=this.mensagens.filter((msn)=>msn.id_user1==this.chatParams.id_user2)

        console.log(val)
      },

      error: (err)=>{
        console.error(err)
      }
    })
  }

  eMinhaMsn(msn:any){
    console.log(msn)
    const minhasMsn=msn.id_user1== this.chatParams.id_user;

    return minhasMsn;
     
  }

  checkFields(): boolean {
    const mensagem = this.mensagem.nativeElement.value;

    if (mensagem) {
      return true;
    } else {
      return false;
    }
  }
  toggleChatbox() {
    this.showChatbox = !this.showChatbox;
      this.receberMensagens()

  }
}
