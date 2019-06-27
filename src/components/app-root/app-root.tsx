import { Component, h, Element, Listen } from '@stencil/core';
// import { IAppState, ITodoItem } from "../../interfaces/app-interfaces";
import { SwitchboardOperator } from '../../state/switchboard-operator';
import { AppStateController, AppState, Actions } from '../../state/app-state';

// interface ActionCallbackMapping {
//   eventName: string,
//   callback: Function
// }

// interface ElementActionCallbackMapping {
//   elementId: string,
//   callbacks: ActionCallbackMapping[]
// }

// enum Actions {
//   todoItemChecked = 'todoItemChecked',
//   todoItemUnchecked = 'todoItemUnchecked'
// }

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  @Element() el: HTMLAppRootElement;

  // private appState = {} as IAppState;
  // private actionCallbackRegistry = [] as ElementActionCallbackMapping[];

  async componentWillLoad() {

    await AppStateController.initializeController();
    SwitchboardOperator.setRootElement(this.el);
    // await this.getInitialState();
  }

  // async getInitialState() {

  //   // TODO: Retrieve initial state from persisted storage
  //   this.appState = {
  //     incompleteTodos: {
  //       items: [
  //         { id: '09dsht', summary: 'Test 2', isComplete: false },
  //         { id: 'lfa09h', summary: 'Test 3', isComplete: false },
  //         { id: 'flk2jg', summary: 'Test 4', isComplete: false }
  //       ],
  //       count: 0
  //     },
  //     completeTodos: {
  //       items: [
  //         { id: 'l1kj3t', summary: 'Test 1', isComplete: true }
  //       ],
  //       count: 0
  //     }
  //   }
  // }

  // Action handler functions

  // handleTodoItemCheckedChanged(event: any) {

  //   let item = event.detail.item as ITodoItem;

  //   // console.log('Handling item checked: ', item);

  //   if (item.isComplete) {

  //     // Remove item from incomplete items list
  //     this.appState.incompleteTodos.items =
  //       this.appState.incompleteTodos.items.filter(i => {
  //         return i.id != item.id;
  //       });
  //     this.appState.incompleteTodos.count =
  //       this.appState.incompleteTodos.items.length;
  //     // Add item to complete items list
  //     this.appState.completeTodos.items =
  //       [...this.appState.completeTodos.items, item];
  //     this.appState.completeTodos.count =
  //       this.appState.completeTodos.items.length;

  //     // Notify subscribers to event todoItemChecked
  //     this.executeElementEventCallbacks(Actions.todoItemChecked);
  //   }
  //   else {

  //     // Remove item from complete items list
  //     this.appState.completeTodos.items =
  //       this.appState.completeTodos.items.filter(i => {
  //         return i.id != item.id;
  //       });
  //     this.appState.completeTodos.count =
  //       this.appState.completeTodos.items.length;
  //     // Add item to incomplete items list
  //     this.appState.incompleteTodos.items =
  //       [...this.appState.incompleteTodos.items, item];
  //     this.appState.incompleteTodos.count =
  //       this.appState.incompleteTodos.items.length;

  //     // Notify subscribers to event todoItemUnchecked
  //     this.executeElementEventCallbacks(Actions.todoItemUnchecked);
  //   }

  // }

  // async registerElementEventCallback(elementId: string,
  //   eventName: string, callback: Function) {

  //   let elemEventCallbacks = this.actionCallbackRegistry.find(e => {
  //     return e.elementId === elementId
  //   });

  //   if (!elemEventCallbacks) {

  //     this.actionCallbackRegistry.push({
  //       elementId: elementId,
  //       callbacks: []
  //     });

  //     elemEventCallbacks = this.actionCallbackRegistry.find(e => {
  //       return e.elementId === elementId
  //     });
  //   }

  //   let eventCallbackRegistration = elemEventCallbacks.callbacks.find(c => {
  //     return c.eventName === eventName;
  //   });

  //   if (!eventCallbackRegistration) {

  //     elemEventCallbacks.callbacks.push({
  //       eventName: eventName,
  //       callback: callback
  //     });
  //   }

  // }

  // async executeElementEventCallbacks(eventName: string) {

  //   console.log('Executing callbacks for event: ', eventName);

  //   for (let r of this.actionCallbackRegistry) {
  //     for (let cb of r.callbacks) {
  //       if (cb.eventName === eventName) {
  //         console.log(`Calling ${cb.callback.toString()} on ${r.elementId}`);
  //         await cb.callback();
  //       }
  //     }
  //   }
  // }

  @Listen('DOMNodeInserted', { target: 'document' })
  handleDomNodeInserted(event: any) {

    if (!event) return;

    if (!event.relatedNode) {
      console.log('Event does not contain relatedNode property.');
    };

    const element = event.relatedNode;

    switch (element.id) {

      case 'incompleteItemsList': {

        let list = element as HTMLTodoListElement;
        // Events => Actions
        SwitchboardOperator.registerElementEventToStateActionHandler(
          'onItemCheckedChanged', 
          (e) => AppStateController.handleTodoItemCheckedChanged(e),
          list.id
        );
        // Actions => Methods
        SwitchboardOperator.registerStateActionToElementCallback(
          Actions.todoItemChecked,
          () => list.setTodos(AppState.incompleteTodos.items)
        );
        SwitchboardOperator.registerStateActionToElementCallback(
          Actions.todoItemUnchecked,
          () => list.setTodos(AppState.incompleteTodos.items)
        );
        // Set initial component state
        list.setTodos(AppState.incompleteTodos.items);
        break;
      }

      case 'completedItemsList': {

        let list = element as HTMLTodoListElement;
        // Events => Actions
        SwitchboardOperator.registerElementEventToStateActionHandler(
          'onItemCheckedChanged', 
          (e) => AppStateController.handleTodoItemCheckedChanged(e),
          list.id
        );
        // Actions => Methods
        SwitchboardOperator.registerStateActionToElementCallback(
          Actions.todoItemUnchecked,
          () => list.setTodos(AppState.completeTodos.items)
        );
        // Set initial component state
        list.setTodos(AppState.completeTodos.items);
        break;
      }

      case 'incompleteItemsCount': {

        let badge = element as HTMLToolbarBadgeElement;
        // Events => Actions
        // ...none
        // Actions => Methods
        SwitchboardOperator.registerStateActionToElementCallback(
          Actions.todoItemChecked,
          () => badge.setContent(AppState.incompleteTodos.count)
        );
        SwitchboardOperator.registerStateActionToElementCallback(
          Actions.todoItemUnchecked,
          () => badge.setContent(AppState.incompleteTodos.count)
        );
        // Set initial component state
        badge.setContent(AppState.incompleteTodos.count);
        break;
      }

      case 'completedItemsCount': {

        let badge = element as HTMLToolbarBadgeElement;
        // Events => Actions
        // ...none
        // Actions => Methods
        SwitchboardOperator.registerStateActionToElementCallback(
          Actions.todoItemChecked,
          () => badge.setContent(AppState.completeTodos.count)
        );
        SwitchboardOperator.registerStateActionToElementCallback(
          Actions.todoItemUnchecked,
          () => badge.setContent(AppState.completeTodos.count)
        );
        // Set initial component state
        badge.setContent(AppState.completeTodos.count);
        break;
      }
    }

    // if (element.id === 'incompleteItemsList') {

    //   let elem = element as HTMLTodoListElement;

    //   // Map from component events to state mangement action handlers
    //   this.el.addEventListener('onItemCheckedChanged', (e: any) => {
    //     // Take item from event detail, pass to state mgmt handler
    //     this.handleTodoItemCheckedChanged(e);
    //   });

    //   // Map from state management actions to component methods
    //   this.registerElementEventCallback(
    //     element.id,
    //     Actions.todoItemChecked,
    //     () => {
    //       elem.setTodos(this.appState.incompleteTodos.items);
    //     });

    //   elem.setTodos(this.appState.incompleteTodos.items);

    // }
    // else if (element.id === 'completedItemsList') {

    //   let elem = element as HTMLTodoListElement;

    //   // Map from component events to state mangement action handlers
    //   this.el.addEventListener('onItemCheckedChanged', (e: any) => {
    //     // Take item from event detail, pass to state mgmt handler
    //     this.handleTodoItemCheckedChanged(e);
    //   });

    //   // Map from state management actions to component methods
    //   this.registerElementEventCallback(
    //     element.id,
    //     Actions.todoItemChecked,
    //     () => {
    //       elem.setTodos(this.appState.completeTodos.items);
    //     });

    //   elem.setTodos(this.appState.completeTodos.items);
    // }
    // else if (element.id === 'incompleteItemsCount') {

    //   let elem = element as HTMLToolbarBadgeElement;

    //   // Map from state management actions to component methods
    //   this.registerElementEventCallback(
    //     element.id,
    //     Actions.todoItemChecked,
    //     () => {
    //       elem.setContent(this.appState.incompleteTodos.count);
    //     });

    //   elem.setContent(this.appState.incompleteTodos.items.length);
    // }
    // else if (element.id === 'completedItemsCount') {
      
    //   let elem = element as HTMLToolbarBadgeElement;

    //   // Map from state management actions to component methods
    //   this.registerElementEventCallback(
    //     element.id,
    //     Actions.todoItemUnchecked,
    //     () => {
    //       elem.setContent(this.appState.completeTodos.count);
    //     });

    //   elem.setContent(this.appState.completeTodos.items.length);
    // }
  }

  @Listen('DOMNodeRemoved', { target: 'document' })
  handleDomNodeRemoved(_event: any) {

    //TODO: Unregister callbacks ?
  }

  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="app-home" />
          <ion-route url="/done" component="completed-items" />
        </ion-router>
        <ion-modal-controller />
        <ion-toast-controller />
        <ion-nav />
      </ion-app>
    );
  }
}
