import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetsService {
  url='https://servidor-ushare.vercel.app'

  // url='http://localhost:3000'
  constructor(private http: HttpClient) { }
  
  verAnunciosDoMunicipio(id_munic: any): Observable<any[]> {
    const params = new HttpParams().set('id_munic', id_munic);
    return this.http.get<any[]>(this.url+'/anuncios', { params });
  }

  verEventosDoMunicipio(id_munic: any): Observable<any[]> {
    const params = new HttpParams().set('id_munic', id_munic);
    return this.http.get<any[]>(this.url+'/eventos', { params });
  }


  obterAutor(id_user: any): Observable<any[]> {
    const params = new HttpParams().set('id_user', id_user);
    return this.http.get<any>(this.url+'/utilizador', { params });
  }

  obterComentarioDoPost(id_anuncio: any): Observable<any[]> {
    const params = new HttpParams().set('id_anuncio', id_anuncio);
    return this.http.get<any>(this.url+'/comentarios', { params });
  }
  
  obterConexoes(id_user: any): Observable<any[]> {
    const params = new HttpParams().set('id_user1', id_user);
    return this.http.get<any>(this.url+'/conexoes', { params });
  }
  obterInteressadosAnuncio(id_anuncio: any): Observable<any[]> {
    const params = new HttpParams().set('id_anuncio', id_anuncio);
    return this.http.get<any>(this.url+'/interessados_anuncios', { params });
  }

  obterMensagens(id_user1: any, id_user2: any): Observable<any[]> {
    let params = new HttpParams().set('id_user', id_user1);
    params = params.set('id_user2', id_user2);

    return this.http.get<any[]>(`${this.url}/mensagem`, { params });
  }


  obterPostsPesquisa(id_munic:any): Observable<any[]> {
    let params = new HttpParams().set('id_munic', id_munic);

    return this.http.get<any[]>(`${this.url}/posts`, { params });
  }


}