import { ITodoItemList, ITodoItem } from "../interfaces/app-interfaces";
import { SB } from "./switchboard-operator";
import { ToastService } from "../services/toast-service";
import { Storage } from "../services/storage-service";

export interface IAppState {
  incompleteTodos: ITodoItemList,
  completeTodos: ITodoItemList
}

// export var AppState = {} as IAppState;

export const enum Actions {
  todoItemAdded = 'todoItemAdded',
  todoItemChecked = 'todoItemChecked',
  todoItemUnchecked = 'todoItemUnchecked',
  todoItemDeleted = 'todoItemDeleted'
}

//TODO: Move away from using Singleton as it exposes itself to the entire app,
// defeating the purpose of controlling state mutation and forcing updates through events
export class AppStateController {

  // public Actions = {
  //   totoItemAdded: 'todoItemAdded',
  //   todoItemChecked: 'todoItemChecked',
  //   todoItemUnchecked: 'todoItemUnchecked',
  //   todoItemDeleted: 'todoItemDeleted'
  // }

  private appState = {} as IAppState;

  getAppState() {
    return this.appState;
  }

  async initialize() {

    console.log("Initializing app state controller...");
    await this.getInitialAppState();

  }

  async getInitialAppState() {

    console.log("Getting initial app state...");

    try {

      const savedState = Storage.loadState();

      console.log("saved state: ", savedState);

      if (!savedState) {
        throw new Error("No saved state");
      }

      this.appState = savedState;
    }
    catch (error) {

      console.log("loading default initial state");
      this.appState = {
        incompleteTodos: {
          items: [
            { id: '09dsht', summary: 'Add a to-do', isComplete: false }
          ],
          count: 1
        },
        completeTodos: {
          items: [
            { id: 'l1kj3t', summary: 'Get the app', isComplete: true }
          ],
          count: 1
        }
      }
    }
  }

  async handleTodoItemAdded(event: any) {

    console.log("Handling todoItemAdded event: ", event);
    let item = event.detail.item as ITodoItem;

    if (!item) {
      throw new Error("Event did not contain expected item");
    }

    this.appState.incompleteTodos.items = [...this.appState.incompleteTodos.items, item];
    this.appState.incompleteTodos.count = this.appState.incompleteTodos.items.length;
    // Execute element callbacks associated with action
    await SB.executeElementCallbacksForStateAction(Actions.todoItemAdded);

    Storage.saveState(this.appState);
  }

  async handleTodoItemCheckedChanged(event: any) {

    console.log('Handling todoItemCheckedChanged event: ', event);
    let item = event.detail.item as ITodoItem;

    if (!item) {
      throw new Error("Event did not contain expected item");
    }

    if (item.isComplete) {
      // Remove item from incomplete items list
      this.appState.incompleteTodos.items = 
        this.appState.incompleteTodos.items.filter(i => {
          return i.id != item.id;
        });
      this.appState.incompleteTodos.count = this.appState.incompleteTodos.items.length;
      // Add item to complete items list
      this.appState.completeTodos.items = [...this.appState.completeTodos.items, item];
      // Ensure no duplicates exist
      this.appState.completeTodos.items = Array.from(new Set(this.appState.completeTodos.items));
      this.appState.completeTodos.count = this.appState.completeTodos.items.length;
      // Execute element callbacks associated with action
      SB.executeElementCallbacksForStateAction(Actions.todoItemChecked);
      ToastService.showSuccessToast("Well done!", "top");
    }
    else {
      // Remove item from complete items list
      this.appState.completeTodos.items =
        this.appState.completeTodos.items.filter(i => {
          return i.id != item.id;
        });
      this.appState.completeTodos.count = this.appState.completeTodos.items.length;
      // Add item to incomplete items list ensuring no duplicates exist
      this.appState.incompleteTodos.items = Array.from(new Set([...this.appState.incompleteTodos.items, item]));
      this.appState.incompleteTodos.count = this.appState.incompleteTodos.items.length;
      // Execute element callbacks associated with action
      await SB.executeElementCallbacksForStateAction(Actions.todoItemUnchecked);
      ToastService.showSuccessToast("Okay, bringing it back.", "top")
    }

    Storage.saveState(this.appState);
  }
  
  async handleTodoItemDeleted(event: any) {

    console.log("Handling todoItemDeleted event: ", event);
    let item = event.detail.item as ITodoItem;

    if (!item) {
      throw new Error("Event did not contain expected item");
    }

    // Remove item from incomplete items list
    this.appState.incompleteTodos.items =
      this.appState.incompleteTodos.items.filter(i => {
        return i.id != item.id;
      });
    this.appState.incompleteTodos.count = this.appState.incompleteTodos.items.length;
    // Remove item from complete items list
    this.appState.completeTodos.items =
      this.appState.completeTodos.items.filter(i => {
        return i.id != item.id;
      });
    this.appState.completeTodos.count = this.appState.completeTodos.items.length;

    // Execute element callbacks associated with action
    await SB.executeElementCallbacksForStateAction(Actions.todoItemDeleted);

    Storage.saveState(this.appState);
  }

}

// export const App = new AppStateController();