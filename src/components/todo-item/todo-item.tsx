import { Component, h, Event, EventEmitter, Prop, State } from "@stencil/core";
import { ITodoItem } from "../../interfaces/app-interfaces";

@Component({
  tag: 'todo-item'
})
export class TodoItem {

  @Event() onTodoItemChecked: EventEmitter;
  @Event() onTodoItemUnchecked: EventEmitter;

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

      this.onTodoItemChecked.emit({ item: this._todo });
    }
    else {

      this.onTodoItemUnchecked.emit({ item: this._todo });
    }
  }

  render() {
    return [

      <ion-item>
        <ion-checkbox slot='start' checked={this._todo.isComplete}
          onIonChange={() => this.handleItemCheckedChanged()} />
        <ion-label style={{
          fontStyle: this._todo.isComplete ? 'italic' : 'normal'
        }}>
          {this._todo.summary}
        </ion-label>
      </ion-item>
    ];
  }
}