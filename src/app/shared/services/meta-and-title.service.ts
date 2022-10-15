import { Injectable, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';
import metaData from '../helpers/meta-data';

@Injectable({
  providedIn: 'root'
})
export class MetaAndTitleService implements OnDestroy {

  private subscription = new Subscription;
  private urlPaths = [];

  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {
    this.subscription.add(this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        this.urlPaths = url.split("/");
        this.updateTitle(url);
        this.updateMeta(url);
      }
    }));
  }

  private updateTitle(url: string): void {
    if(typeof metaData[this.urlPaths[1]] === "undefined"){
      this.title.setTitle(metaData['/'].title);
    }else{
      this.title.setTitle(metaData[this.urlPaths[1]].title);
    }
  }

  private updateMeta(url: string): void {
    const oldTagDescription = this.meta.getTag('name="description"');

    const newTagDescription = {
      name: 'description',
      content: metaData["/"+this.urlPaths[1]].metas.description
    }

    oldTagDescription
      ? this.meta.updateTag(newTagDescription)
      : this.meta.addTag(newTagDescription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
