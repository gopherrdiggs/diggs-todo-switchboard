import { Component, h, Event, EventEmitter, Prop, State } from "@stencil/core";
import { ITodoItem } from "../../interfaces/app-interfaces";

@Component({
  tag: 'todo-item'
})
export class TodoItem {

  @Event() onItemCheckedChanged: EventEmitter;

  @Prop() todo: ITodoItem;

  @State() _todo: ITodoItem;

  componentWillLoad() {
    
    this._todo = this.todo;
  }

  async handleItemChecked() {

    this._todo = {
      ...this._todo,
      isComplete: !this._todo.isComplete
    };

    // Give time for check animation to happen
    await new Promise(resolve => setTimeout(resolve, 400));

    this.onItemCheckedChanged.emit({ item: this._todo });
  }

  render() {
    return [

      <ion-item>
        <ion-checkbox slot='start' checked={this._todo.isComplete}
          onIonChange={() => this.handleItemChecked()} />
        <ion-label style={{
          fontStyle: this._todo.isComplete ? 'italic' : 'normal'
        }}>
          {this._todo.summary}
        </ion-label>
      </ion-item>
    ];
  }
}