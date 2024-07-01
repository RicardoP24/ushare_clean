import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MensagemErroService {

  constructor(private snackBar: MatSnackBar) { }

openErrorSnackBar(message: string) {
  this.snackBar.open(message, 'Close', {
    duration: 5000, 
    // Duration in milliseconds
    panelClass: ['mat-toolbar', 'mat-warn'] // Optional CSS classes for styling
  });
}

}
