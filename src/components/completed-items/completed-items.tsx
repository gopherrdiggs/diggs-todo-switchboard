import { Component, h, State } from "@stencil/core";

@Component({
  tag: 'completed-items'
})
export class CompletedItems {

  @State() itemCount: number = 0;

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Diggs To-Do</ion-title>
          <toolbar-badge id='completedItemsCount' slot='end' />
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        
        <ion-item>
          <ion-label>Stuff done:</ion-label>
        </ion-item>

        <todo-list id='completedItemsList'/> 
        
        <ion-fab vertical='bottom' horizontal='start'>
          <ion-fab-button color='primary'
                          href='/' routerDirection='back'>
            <ion-icon name='home' />
          </ion-fab-button>
        </ion-fab>
      </ion-content>
    ];
  }
}