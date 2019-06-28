import { Component, h, Listen, State } from "@stencil/core";
import { ModalService } from "../../services/modal-service";
import { ITodoItem } from "../../interfaces/app-interfaces";
import { generateUniqueId } from "../../helpers/utils";

@Component({
  tag: 'todo-add'
})
export class TodoAdd {

  @State() _todo = {} as ITodoItem;

  async handleCloseClick() {

    await ModalService.getController().dismiss();
  }

  async handleSaveClick() {

    let newTodo = {} as ITodoItem;
    newTodo.id = generateUniqueId();
    newTodo.summary = this._todo.summary;
    newTodo.isComplete = false;

    await ModalService.getController().dismiss({ item: newTodo});
  }

  async handleSummaryChange(event: any) {

    this._todo.summary = event.target.value;
  }

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent){
    if (ev.key === 'Enter'){
      this.handleSaveClick();
    }
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