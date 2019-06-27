import { ITodoItemList, ITodoItem } from "../interfaces/app-interfaces";
import { SwitchboardOperator } from "./switchboard-operator";

//TODO: Remove from ../interfaces/app-interfaces
interface IAppState {
  incompleteTodos: ITodoItemList,
  completeTodos: ITodoItemList
}
// as app state grows, decompose this interface along with domain-specific controllers

export var AppState = {} as IAppState;

export const enum Actions {
  todoItemChecked= 'todoItemChecked',
  todoItemUnchecked= 'todoItemUnchecked'
}

class AppStateActionController {

  async initializeController() {

    console.log("Initializing app state controller...");
    await this.getInitialAppState();
  }

  async getInitialAppState() {

    console.log("Getting initial app state...");
    AppState = {
      incompleteTodos: {
        items: [
          { id: '09dsht', summary: 'Test 2', isComplete: false },
          { id: 'lfa09h', summary: 'Test 3', isComplete: false },
          { id: 'flk2jg', summary: 'Test 4', isComplete: false }
        ],
        count: 3
      },
      completeTodos: {
        items: [
          { id: 'l1kj3t', summary: 'Test 1', isComplete: true }
        ],
        count: 1
      }
    }
  }

  handleTodoItemCheckedChanged(event: any) {

    console.log('Handling todoItemCheckedChanged event: ', event);
    let item = event.detail.item as ITodoItem;

    if (item.isComplete) {
      // Remove item from incomplete items list
      AppState.incompleteTodos.items = 
        AppState.incompleteTodos.items.filter(i => {
          return i.id != item.id;
        });
      AppState.incompleteTodos.count = 
        AppState.incompleteTodos.items.length;
      // Add item to complete items list
      AppState.completeTodos.items =
        [...AppState.completeTodos.items, item];
      AppState.completeTodos.count =
        AppState.completeTodos.items.length;
      // Execute element callbacks associated with action
      SwitchboardOperator.executeElementCallbacksForStateAction(Actions.todoItemChecked);
    }
    else {
      // Remove item from complete items list
      AppState.completeTodos.items =
        AppState.completeTodos.items.filter(i => {
          return i.id != item.id;
        });
      AppState.completeTodos.count =
        AppState.completeTodos.items.length;
      // Add item to incomplete items list
      AppState.incompleteTodos.items =
        [...AppState.incompleteTodos.items, item];
      AppState.incompleteTodos.count =
        AppState.incompleteTodos.items.length;
      // Execute element callbacks associated with action
      SwitchboardOperator.executeElementCallbacksForStateAction(Actions.todoItemUnchecked);
    }
  }
  
  

}

export const AppStateController = new AppStateActionController();