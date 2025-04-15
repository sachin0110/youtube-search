import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  // Create a signal to hold the shared state
  public sharedSignal = signal<string>('');

  // Method to update the signal's value
  updateValue(newValue: string) {
    this.sharedSignal.set(newValue);
  }
}
