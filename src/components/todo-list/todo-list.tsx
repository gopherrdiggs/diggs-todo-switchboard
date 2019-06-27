import { Component, h, Event, EventEmitter, Listen, State, Method } from "@stencil/core";
import { ITodoItem } from "../../interfaces/app-interfaces";


@Component({
  tag: 'todo-list'
})
export class TodoList {

  @Event() onTodoItemCheckedChanged: EventEmitter;
  @Event() onTodoItemDeleted: EventEmitter;

  @State() _todos: ITodoItem[] = [];

  @Method()
  async setTodos(todos: ITodoItem[]) {

    this._todos = todos;
  }

  @Listen('onTodoItemCheck', { target: 'document' })
  @Listen('onTodoItemUncheck', { target: 'document' })
  async handleTodoItemChecked(event: any) {

    this.onTodoItemCheckedChanged.emit({ item: event.detail.item })
  }

  @Listen('onTodoItemDelete', { target: 'document' })
  async handleTodoItemDeleted(event: any) {

    this.onTodoItemDeleted.emit({ item: event.detail.item });
  }

  render() {
    return [
      <ion-list>
        {this._todos.map(t => 
          <todo-item key={t.id} todo={t} />  
        )}
      </ion-list>
    ];
  }
}