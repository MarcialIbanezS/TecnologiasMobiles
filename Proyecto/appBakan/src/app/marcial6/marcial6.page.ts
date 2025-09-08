import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IonImg } from '@ionic/angular/standalone';

import {
  IonItem,
  IonLabel,
  IonList,
  IonReorder,
  IonReorderGroup,
  ReorderEndCustomEvent,
  ReorderMoveCustomEvent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-marcial6',
  templateUrl: './marcial6.page.html',
  styleUrls: ['./marcial6.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, RouterModule,
    IonToolbar, CommonModule, FormsModule,IonBreadcrumb, IonBreadcrumbs, IonImg,
    IonItem, IonLabel, IonList, IonReorder, IonReorderGroup
  ]
})
export class Marcial6Page implements OnInit {

  constructor(private router: Router) {}

  items = ['Revolver', 'Shotgun', 'Nailgun', 'Railcanon', 'Rocket Launcher'];
  images=["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpbs.twimg.com%2Fmedia%2FFUVFHqsXwAAb882.png%3Alarge&f=1&nofb=1&ipt=1d3f30b315cabe9389ba5c72f92f3baa7399f6e5bbe4be0e9f2eb3c69f6706d6",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fultrakill%2Fimages%2Fb%2Fb9%2FCore_Shotgun.png%2Frevision%2Flatest%3Fcb%3D20220819093937&f=1&nofb=1&ipt=b218fe8e2011e4714080572a0a632c9eff8a4fa54fb7412f2d8bd44dd8bc47fe",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fultrakill.wiki.gg%2Fimages%2Fthumb%2Ff%2Ff9%2FModel_Nailgun1_Overheat_1.png%2F192px-Model_Nailgun1_Overheat_1.png&f=1&nofb=1&ipt=b846e4ba289cd802c5fe215b7967dd4022d9809c6ab00df2ee9a5c03f0ac4a90",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fultrakill%2Fimages%2F1%2F18%2FChargedSRail.png%2Frevision%2Flatest%3Fcb%3D20220819100953&f=1&nofb=1&ipt=2ab595de011e3e03dbb06d066e6fbb787133c5307be40c5e6fcd2ff30297aa5e",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fultrakill%2Fimages%2F4%2F48%2FFreezeframe.png%2Frevision%2Flatest%3Fcb%3D20220819100707&f=1&nofb=1&ipt=b22e528d4f6f5595fd39d6bb583d4e195934604751bf034d203bccac8005ab7c"

  ]

  handleReorderMove(event: ReorderMoveCustomEvent) {
    const from = event.detail.from;
    const to = event.detail.to;

    if (from !== to) {
      console.log('Dragged from index', from, 'to', to);
    }

    // Get all items and sort by their current id (item-1, item-2, ...)
    const itemElements = Array.from(document.querySelectorAll('ion-item')).sort((a, b) => {
      const aNum = parseInt(a.id.replace('item-', ''), 10);
      const bNum = parseInt(b.id.replace('item-', ''), 10);
      return aNum - bNum;
    });

    // Dragging down: shift up items between from+1 and to, set dragged to to+1
    if (from < to) {
      for (let i = from; i <= to; i++) {
        const item = itemElements[i];
        const itemNum = item.querySelector('b');
        if (itemNum) {
          if (i === from) {
            // Dragged item
            itemNum.textContent = String(to + 1);
            item.id = `item-${to + 1}`;
          } else {
            // Items shift up
            itemNum.textContent = String(i);
            item.id = `item-${i}`;
          }
        }
      }
      // Dragging up: shift down items between to and from-1, set dragged to to+1
    } else if (from > to) {
      for (let i = to; i <= from; i++) {
        const item = itemElements[i];
        const itemNum = item.querySelector('b');
        if (itemNum) {
          if (i === from) {
            // Dragged item
            itemNum.textContent = String(to + 1);
            item.id = `item-${to + 1}`;
          } else {
            // Items shift down
            itemNum.textContent = String(i + 2);
            item.id = `item-${i + 2}`;
          }
        }
      }
    }
  }

  handleReorderEnd(event: ReorderEndCustomEvent) {
    // Finish the reorder and update the items data
    // We need to reorder both items and images arrays in sync
    const oldItems = [...this.items];
    const oldImages = [...this.images];
    this.items = event.detail.complete(this.items);
    // Reorder images to match new items order
    this.images = this.items.map(item => {
      const idx = oldItems.indexOf(item);
      return oldImages[idx];
    });
    console.log('Items after reorder:', this.items);
  }
  
  irAHome() {
    this.router.navigate(['/home']);       
  }
  irAMarcial1() {
    this.router.navigate(['/pagina1']);       
  }

  irAMarcial6() {
    this.router.navigate(['/marcial6']);       
  }

  ngOnInit() {
  }

}


