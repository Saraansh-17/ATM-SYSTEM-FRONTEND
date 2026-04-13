import { Component } from '@angular/core';

import { AtmShellComponent } from './atm-shell/atm-shell.component';
import { ToastHostComponent } from './core/toast-host.component';

@Component({
  selector: 'app-root',
  imports: [AtmShellComponent, ToastHostComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
