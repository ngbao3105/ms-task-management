import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ms-assignment';
  constructor(private matIconRegistry: MatIconRegistry, private _domSanitizer: DomSanitizer) {
    this._registerMatIcon();
  }

  private _registerMatIcon() {
    this.matIconRegistry.addSvgIcon(
      'filter',
      this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/filter-icon.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'close',
      this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/close-icon.svg')
    );
  }
}
