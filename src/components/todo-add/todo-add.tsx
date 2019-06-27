import { Component, h, State } from "@stencil/core";
import { ModalService } from "../../services/modal-service";
import { ITodoItem } from "../../interfaces/app-interfaces";

@Component({
  tag: 'todo-add'
})
export class TodoAdd {

  @State() _todo = {} as ITodoItem;

  async handleCloseClick() {

    await ModalService.getController().dismiss();
  }

  async handleSaveClick() {

    await ModalService.getController().dismiss({ item: this._todo });
  }

  async handleSummaryChange(event: any) {

    this._todo.summary = event.target.value;
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color='secondary'>
          <ion-buttons slot='start'>
            <ion-button fill='clear'
                        onClick={()=>this.handleCloseClick()}>
              <ion-icon slot='icon-only' name='close' />
            </ion-button>
          </ion-buttons>
          <ion-title>
            Add To-Do
          </ion-title>
          <ion-buttons slot='end'>
            <ion-button color='primary' fill='solid' shape='round'
                        onClick={()=>this.handleSaveClick()}>
              <ion-icon slot='icon-only' name='checkmark' />
            </ion-button>
          </ion-buttons>
      </ion-toolbar>
      </ion-header>,
      <ion-content class='ion-padding'>
        <ion-item>
          <ion-label position='stacked'>
            Summary
          </ion-label>
          <ion-input type='text' value={this._todo.summary}
                     onIonChange={(e)=>this.handleSummaryChange(e)} />
        </ion-item>
      </ion-content>
    ];
  }
}