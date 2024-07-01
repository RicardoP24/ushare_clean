import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../servicos/posts.service';
import { MensagemSucessoService } from '../../servicos/mensagem-sucesso.service';
import { Observable } from 'rxjs';
import { GetsService } from '../../servicos/gets.service';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.scss'
})
export class ComentariosComponent {


  postCreationDate = ''
  @ViewChild('commentField') comentariosField!: ElementRef;
  comentarios:any[]=[];

  constructor(@Inject(MAT_DIALOG_DATA,) public data: any,
    private postServ: PostsService, 
    private getServ: GetsService, 
    private fechar: MatDialog,
     public dialogRef: MatDialogRef<ComentariosComponent>,
    private msnSucesso:MensagemSucessoService
  ) {



  }

   

  enviarComentario() {

    let response$:Observable<any>;
    if (this.comentariosField.nativeElement.value && this.comentariosField.nativeElement.value.trim() !='' ){
      response$=this.postServ.ComentarAnuncio({ id_anuncio: this.data.id, id_user: this.data.meuId, comentario:this.comentariosField.nativeElement.value})
      response$.subscribe({
        next:()=>{
          this.receberComentarios()
          this.msnSucesso.openSuccessSnackBar('Sucesso')
        },
        error:(err)=>{
          this.msnSucesso.openSuccessSnackBar(err)
        }
      })
    }
  }

  receberComentarios(){

    let comentarios$:Observable<any> = this.getServ.obterComentarioDoPost(this.data.id);

    let i=0;
    comentarios$.subscribe({
      next:(comments)=>{

        this.comentarios=comments;

        for(let cm of this.comentarios){

          let autores$: Observable<any> = this.getServ.obterAutor(cm.id_user)
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
  
  
              this.comentarios[i] = {
                ...this.comentarios[i], nomeAutor: nome,
                idAutor: id,
                id_distAutor: id_dist,
                id_municAutor: id_munic,
                coordenadasmoradaAutor: coordenadasmorada,
                emailAutor: email,
                nifAutor: nif,
                tipoUserAutor: tipouser,  
              }
              i++;
  
  
            },
  
            error: (err) => {
              console.error(err)
            }
          })
        }
      },

      error:()=>{

      }
    })
  }

  ngAfterViewInit() {
    this.dialogRef.afterOpened().subscribe(() => {
      this.receberComentarios()

      console.log(this.data)
    });
  }





  close() {
    this.fechar.closeAll();

  }

}
