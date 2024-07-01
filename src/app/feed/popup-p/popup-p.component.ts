import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { UploadService } from '../../servicos/upload.service';
import { Observable } from 'rxjs';
import { PostsService } from '../../servicos/posts.service';
import { MensagemSucessoService } from '../../servicos/mensagem-sucesso.service';
import { LocalStorageService } from '../../servicos/local-storage.service';
import { GetsService } from '../../servicos/gets.service';


interface TipoPost {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-popup-p',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './popup-p.component.html',
  styleUrl: './popup-p.component.scss',
  providers:[UploadService]
})


export class PopupPComponent {


  title: string = "Publique o seu anúncio";
  postTitle: string = "";
  postType: string = "";
  postDescription: string = "";
  url$!:Observable<any>;

  @ViewChild('titulo') titulo!: ElementRef;
  @ViewChild('tipoAnuncio') tipoAnuncio!: ElementRef;
  @ViewChild('tipoPost') tipoPost!: MatSelect;
  @ViewChild('descricao') descricao!: ElementRef;
  @ViewChild('imagem') imagem!: ElementRef;


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

  file!: File;

  tipoPosts: TipoPost[] = [
    { value: 'Alerta', viewValue: 'Alerta' },
    { value: 'Solicitação de artigo', viewValue: 'Solicitação de artigo' },
    { value: 'Disponibilização de artigo', viewValue: 'Disponibilização de artigo' },
  ];

 

  imageUrl: string | ArrayBuffer | null = null;


  constructor(private getS:GetsService,private upload: UploadService, private subbtn: MatDialog, private posts:PostsService, private msnSucesso:MensagemSucessoService,private localStore:LocalStorageService) {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      let userdata: string = this.localStore.getItem('user')!;
      let dados:any;
      if (userdata) {


        dados = JSON.parse(userdata)

      }
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

      if(this.dadosUtilizador.tipouser=="org-1"){
        this.tipoPosts.push({ value: 'Evento', viewValue: 'Evento' })
      }
    }, 100);
  }


  checkFields(): boolean {
    const postTitle = this.titulo.nativeElement.value;
    const tipoDePost = this.tipoPost.value;
    const postDescription = this.descricao.nativeElement.value;

    if (postTitle && tipoDePost && postDescription) {
      return true;
    } else {
      return false;
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.file = file;
      this.getImageFromFile(file);
      this.imagem.nativeElement.style.display = 'block'
    }
  }

  getImageFromFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(file);
  }


   publishPost() {

 
    if (this.checkFields()) {
      if (this.file){

        this.url$=this.upload.uploadFile(this.file);
        this.url$.subscribe({
          next:(val)=>{
            let post = {
              id_Munic:this.dadosUtilizador.id_munic, 
              id_user:this.dadosUtilizador.id, 
              titulo:this.titulo.nativeElement.value, 
              TipoAnuncio:this.tipoPost.value, 
              linkImagem:val, 
              descricao:this.descricao.nativeElement.value, 
              Estado:'ativo'
            }

            let response$:Observable<any>;

            response$=this.posts.publicarAnuncio(post)

            response$.subscribe({next:(val)=>{

              this.msnSucesso.openSuccessSnackBar("Anúncio publicado com sucesso")
              this.close()
            }})


          },
          error:(err)=>{

          }
        })
      }else{
        let post = {
          id_Munic:this.dadosUtilizador.id_munic, 
          id_user:this.dadosUtilizador.id, 
          titulo:this.titulo.nativeElement.value, 
          TipoAnuncio:this.tipoPost.value, 
          linkImagem:null, 
          descricao:this.descricao.nativeElement.value, 
          Estado:'ativo'
        }

        let response$:Observable<any>;

        response$=this.posts.publicarAnuncio(post)

        response$.subscribe({next:(val)=>{

          this.msnSucesso.openSuccessSnackBar("Anúncio publicado com sucesso")
          this.close()
        },


        error:(err)=>{
          console.error(err)
        }

        
      })
      }
    }
    console.log('Post published!');
  }

  close() {
    this.subbtn.closeAll();


  }
}
