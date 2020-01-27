import {Directive, HostBinding, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appImagePreloader]'
})
export class ImagePreloaderDirective implements OnInit {
  @Input('appImagePreloader') targetSource: string;
  // Set an input so the directive can set a default image.
  @Input() defaultImage = 'assets/img/preloader.gif';
  @HostBinding('attr.src') finalImage: any; // property bound to our host attribute.

  downloadingImage: any; // In class holder of remote image

  // ngOnInit is needed to access the @inputs() variables. these aren't available on constructor()
  ngOnInit() {
    // First set the final image to some default image while we prepare our preloader:
    this.finalImage = this.defaultImage;

    this.downloadingImage = new Image();  // create image object
    this.downloadingImage.onload = () => { // Once image is completed, console.log confirmation and switch our host attribute
      this.finalImage = this.targetSource;  // do the switch 😀
    };
    // Assign the src to that of some_remote_image_url. Since its an Image Object the
    // on assignment from this.targetSource download would start immediately in the background
    // and trigger the onload()
    this.downloadingImage.src = this.targetSource;
  }
}
