import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

// Validator nur eine Funktion die überprüft, ob das eingegebene korrekt ist oder nicht
export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof(control.value) === 'string') {
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = new Observable(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener('loadend', () => {
        // erstellt ein Array von 8 Bit intergers
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header = '';
        let isValid = false;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16); // 16 um auf hexadezimal umzuwandeln
        }
        // ich schaue nach seltenen pattern
        switch (header) {
          case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false;
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    }
  );
  return frObs;
};
