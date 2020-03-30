import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'favr-img',
  templateUrl: './favr-img.component.html',
  styleUrls: ['./favr-img.component.scss'],
})
export class FavrImgComponent implements OnInit {

  @Input() src: string;
  @Input() spinnerSrc = 'assets/img/preloader.gif';
  @Input() alt: string;
  @Input() height = 'auto';
  @Input() width = 'auto';
  @Input() imgClass = 'default-img';
  @Input() loaderClass = 'default-img';

  loading = true;

  onLoad() {
    setTimeout(() => this.loading = false, 1000);
  }

  constructor() { }

  ngOnInit() { }

}
