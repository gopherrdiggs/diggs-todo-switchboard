import { Component, h, State } from "@stencil/core";
import { ModalService } from "../../services/modal-service";
import { ToastService } from "../../services/toast-service";

@Component({
  tag: 'todo-add'
})
export class TodoAdd {

  @State() summary: string = '';

  async handleCloseClick() {

    await ModalService.getController().dismiss();
  }

  async handleAddClick() {

    await ToastService.showSuccessToast('Item added');
    await ModalService.getController().dismiss();
  }

  async handleSummaryChange(event: any) {

    this.summary = event.target.value;
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
                        onClick={()=>this.handleAddClick()}>
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
          <ion-input type='text' value={this.summary}
                     onIonChange={(e)=>this.handleSummaryChange(e)} />
        </ion-item>
      </ion-content>
    ];
  }
}