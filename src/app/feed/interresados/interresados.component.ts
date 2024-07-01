import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interresados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interresados.component.html',
  styleUrl: './interresados.component.scss'
})
export class InterresadosComponent {

  showbox: boolean = false;

  @Input('post') post: any;
  users: any[] = []
  titulo:string=''

  fetchdata() {
    let i = 0;
    this.users=[]
    this.post.forEach((element: any) => {
      if (i < this.post.length - 1)
        this.users.push(element)
      else{
        console.log(element)
        this.titulo=element.titulo
      }

      i++

    });
  }

  close() {

    (document.getElementById('interessados-popup') as HTMLElement).style.display = 'none';

  }
}
