import { Component, h, State, Method } from "@stencil/core";
import { ITodoItem } from "../../interfaces/app-interfaces";


@Component({
  tag: 'todo-list'
})
export class TodoList {

  @State() _todos: ITodoItem[] = [];

  @Method()
  async setTodos(todos: ITodoItem[]) {

    this._todos = todos;
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