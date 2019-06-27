import { Component, h, Event, EventEmitter, Listen, State, Method } from "@stencil/core";
import { ITodoItem } from "../../interfaces/app-interfaces";


@Component({
  tag: 'todo-list'
})
export class TodoList {

  @Event() onTodoItemCheckedChanged: EventEmitter;

  @State() _todos: ITodoItem[] = [];

  @Method()
  async setTodos(todos: ITodoItem[]) {

    this._todos = todos;
  }

  @Listen('onTodoItemChecked', { target: 'document' })
  @Listen('onTodoItemUnchecked', { target: 'document' })
  async handleTodoItemChecked(event: any) {

    this.onTodoItemCheckedChanged.emit({ item: event.detail.item })
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