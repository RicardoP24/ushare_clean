import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MensagemSucessoService {


  constructor(private snackBar: MatSnackBar) { }

openSuccessSnackBar(message: string) {
  this.snackBar.open(message, 'Close', {
    duration: 5000, 
    // Duration in milliseconds
    panelClass: ['mat-toolbar', 'colorSnackSuccess'] // Optional CSS classes for styling
  });
}

}
