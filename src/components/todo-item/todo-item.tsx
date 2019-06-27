import { Component, h, Element, Event, EventEmitter, Prop, State } from "@stencil/core";
import { ITodoItem } from "../../interfaces/app-interfaces";

@Component({
  tag: 'todo-item'
})
export class TodoItem {

  @Element() el: HTMLTodoItemElement;

  @Event() onTodoItemCheck: EventEmitter;
  @Event() onTodoItemUncheck: EventEmitter;
  @Event() onTodoItemDelete: EventEmitter;

  @Prop() todo: ITodoItem;

  @State() _todo: ITodoItem;

  componentWillLoad() {
    
    this._todo = this.todo;
  }

  async handleItemCheckedChanged() {

    this._todo = {
      ...this._todo,
      isComplete: !this._todo.isComplete
    };

    // Give time for check animation to happen
    await new Promise(resolve => setTimeout(resolve, 400));

    if (this._todo.isComplete) {

      this.onTodoItemCheck.emit({ item: this._todo });
    }
    else {

      this.onTodoItemUncheck.emit({ item: this._todo });
    }
  }

  async handleItemSwipe(_event: any) {

    this.onTodoItemDelete.emit({ item: this._todo });
    let slider = this.el.querySelector('ion-item-sliding');
    slider.close();
  }

  render() {
    return [

      <ion-item-sliding>
        <ion-item-options side='start' 
                          onIonSwipe={(e)=>this.handleItemSwipe(e)}>
          <ion-item-option color='danger' expandable>
            <ion-icon name='trash' />
          </ion-item-option>
        </ion-item-options>
        <ion-item>
          <ion-checkbox slot='start' checked={this._todo.isComplete}
            onIonChange={() => this.handleItemCheckedChanged()} />
          <ion-label style={{
            fontStyle: this._todo.isComplete ? 'italic' : 'normal'
          }}>
            {this._todo.summary}
          </ion-label>
        </ion-item>
        <ion-item-options side='end'
                          onIonSwipe={(e)=>this.handleItemSwipe(e)}>
          <ion-item-option color='danger' expandable>
            <ion-icon name='trash' />
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    ];
  }
}