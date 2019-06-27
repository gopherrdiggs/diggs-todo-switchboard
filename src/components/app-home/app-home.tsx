import { Component, h, Event, EventEmitter, State } from '@stencil/core';
import { ModalService } from '../../services/modal-service';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {

  @Event() onTodoItemCreated: EventEmitter;

  @State() itemCount: number = 0;

  async handleAddClick() {

    let modal = await ModalService.getController().create({
      id: 'addTodoModal',
      component: 'todo-add'
    });

    modal.onDidDismiss().then((event: any) => {

      if (event.data) {

        this.onTodoItemCreated.emit({ item: event.data.item });
      }
    });

    await modal.present();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Diggs To-Do</ion-title>
          <toolbar-badge id='incompleteItemsCount' slot='end' />
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        
        <ion-item>
          <ion-label>Stuff to do:</ion-label>
        </ion-item>

        <todo-list id='incompleteItemsList'/> 
        
        <ion-fab vertical='bottom' horizontal='end'>
          <ion-fab-button onClick={()=>this.handleAddClick()}>
            <ion-icon name="add" />
          </ion-fab-button>
        </ion-fab>

        <ion-fab vertical='bottom' horizontal='start'>
          <ion-fab-button color='secondary'
                          href='/done'>
            <ion-icon name='done-all' />
          </ion-fab-button>
        </ion-fab>
      </ion-content>
    ];
  }
}
