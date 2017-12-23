import { Injectable } from "@angular/core";
import { Http, RequestOptionsArgs, Response, ResponseContentType } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Image } from './image';

let imagesToFetch = [
  {
    url: 'assets/images/las-vegas.jpg',
    attribution: 'By Lasvegaslover (Own work) [CC BY 3.0 (http://creativecommons.org/licenses/by/3.0)], via Wikimedia Commons'
  },
  {
    url: 'assets/images/bellagio.jpg',
    attribution: 'By Photographersnature (Own work) [CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons'
  },
  {
    url: 'assets/images/new-york-new-york.jpg',
    attribution: 'By World Wide Gifts (Flickr: USA - Nevada - Las Vegas - Strip) [CC BY-SA 2.0 (http://creativecommons.org/licenses/by-sa/2.0)], via Wikimedia Commons'
  },
  {
    url: 'assets/images/phil-hellmuth.jpg',
    attribution: 'By Photo by flipchip / LasVegasVegas.com [CC BY-SA 2.0 (http://creativecommons.org/licenses/by-sa/2.0)], via Wikimedia Commons'
  }
];

@Injectable()
export class ImageService {

    public images: Image[] = [ ];
    public imagesLoaded: BehaviorSubject<number>;

    constructor(private http:Http) {
        this.imagesLoaded = new BehaviorSubject(0);
        for (let imageToFetch of imagesToFetch) {
            this.getImage(imageToFetch);
        }
    }

    private getImage(image:any) {
        let options: RequestOptionsArgs = {
          responseType: ResponseContentType.ArrayBuffer
        };
        this.http.get(image.url, options)
            .subscribe(
                (response:Response) => this.handleImage(response, image),
                (error:any) => this.handleError(error, image)
            );
    }

    private handleImage(response:Response, image:any) {
        let buffer = response.arrayBuffer();
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        let fetchedImage:Image = new Image(window.btoa(binary), image.attribution);
        this.images.push(fetchedImage);
        this.imagesLoaded.next(this.images.length);
        if (this.images.length === imagesToFetch.length) {
            this.imagesLoaded.complete();
        }
    }

    private handleError(error:any, image:any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        this.getImage(image);
    }
}
