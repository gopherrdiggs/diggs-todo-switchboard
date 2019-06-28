import { ITodoItemList, ITodoItem } from "../interfaces/app-interfaces";
import { SO } from "./switchboard-operator";
import { ToastService } from "../services/toast-service";
import { Storage } from "../services/storage-service";

interface IAppState {
  incompleteTodos: ITodoItemList,
  completeTodos: ITodoItemList
}

export var AppState = {} as IAppState;

export const enum Actions {
  todoItemAdded = 'todoItemAdded',
  todoItemChecked = 'todoItemChecked',
  todoItemUnchecked = 'todoItemUnchecked',
  todoItemDeleted = 'todoItemDeleted'
}

class AppStateActionController {

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
    }
    catch (error) {

      console.log("loading default initial state");
      AppState = {
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

    AppState.incompleteTodos.items = [...AppState.incompleteTodos.items, item];
    AppState.incompleteTodos.count = AppState.incompleteTodos.items.length;
    // Execute element callbacks associated with action
    await SO.executeElementCallbacksForStateAction(Actions.todoItemAdded);

    Storage.saveState(AppState);
  }

  async handleTodoItemCheckedChanged(event: any) {

    console.log('Handling todoItemCheckedChanged event: ', event);
    let item = event.detail.item as ITodoItem;

    if (!item) {
      throw new Error("Event did not contain expected item");
    }

    if (item.isComplete) {
      // Remove item from incomplete items list
      AppState.incompleteTodos.items = 
        AppState.incompleteTodos.items.filter(i => {
          return i.id != item.id;
        });
      AppState.incompleteTodos.count = AppState.incompleteTodos.items.length;
      // Add item to complete items list
      AppState.completeTodos.items = [...AppState.completeTodos.items, item];
      // Ensure no duplicates exist
      AppState.completeTodos.items = Array.from(new Set(AppState.completeTodos.items));
      AppState.completeTodos.count = AppState.completeTodos.items.length;
      // Execute element callbacks associated with action
      SO.executeElementCallbacksForStateAction(Actions.todoItemChecked);
      ToastService.showSuccessToast("Well done!", "top");
    }
    else {
      // Remove item from complete items list
      AppState.completeTodos.items =
        AppState.completeTodos.items.filter(i => {
          return i.id != item.id;
        });
      AppState.completeTodos.count = AppState.completeTodos.items.length;
      // Add item to incomplete items list
      AppState.incompleteTodos.items = [...AppState.incompleteTodos.items, item];
      // Ensure no duplicates exist
      AppState.incompleteTodos.items = Array.from(new Set(AppState.incompleteTodos.items));
      AppState.incompleteTodos.count = AppState.incompleteTodos.items.length;
      // Execute element callbacks associated with action
      await SO.executeElementCallbacksForStateAction(Actions.todoItemUnchecked);
      ToastService.showSuccessToast("Okay, bringing it back.", "top")
    }

    Storage.saveState(AppState);
  }
  
  async handleTodoItemDeleted(event: any) {

    console.log("Handling todoItemDeleted event: ", event);
    let item = event.detail.item as ITodoItem;

    if (!item) {
      throw new Error("Event did not contain expected item");
    }

    // Remove item from incomplete items list
    AppState.incompleteTodos.items =
      AppState.incompleteTodos.items.filter(i => {
        return i.id != item.id;
      });
    AppState.incompleteTodos.count = AppState.incompleteTodos.items.length;
    // Remove item from complete items list
    AppState.completeTodos.items =
      AppState.completeTodos.items.filter(i => {
        return i.id != item.id;
      });
    AppState.completeTodos.count = AppState.completeTodos.items.length;
    // Execute element callbacks associated with action
    await SO.executeElementCallbacksForStateAction(Actions.todoItemDeleted);

    Storage.saveState(AppState);
  }

}

export const App = new AppStateActionController();