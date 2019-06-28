import { Component, h, Element, Listen } from '@stencil/core';
import { SO } from '../../state/switchboard-operator';
import { App, AppState, Actions } from '../../state/app-state';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  @Element() el: HTMLAppRootElement;

  switchboard = {

    incompleteItemsList: (el) => {

      const list = el as HTMLTodoListElement;

      // Actions => Methods
      [ Actions.todoItemAdded, 
        Actions.todoItemDeleted, 
        Actions.todoItemChecked, 
        Actions.todoItemUnchecked ].map((n)=>SO.setCallbackForActions(n,
        ()=>list.setTodos(AppState.incompleteTodos.items)));

      // Set initial component state
      list.setTodos(AppState.incompleteTodos.items);
    },

    incompleteItemsCount: (el) => {

      const badge = el as HTMLToolbarBadgeElement;

      // Actions => Methods
      [ Actions.todoItemAdded, 
        Actions.todoItemDeleted, 
        Actions.todoItemChecked, 
        Actions.todoItemUnchecked ].map((n)=>SO.setCallbackForActions(n,
        () => badge.setContent(AppState.incompleteTodos.count)));
        
      // Set initial component state
      badge.setContent(AppState.incompleteTodos.count);
    },

    completedItemsList: (el) => {

      const list = el as HTMLTodoListElement;

      // Actions => Methods
      [ Actions.todoItemDeleted, 
        Actions.todoItemUnchecked ].map((n)=>SO.setCallbackForActions(n,
        ()=>list.setTodos(AppState.completeTodos.items)));

      // Set initial component state
      list.setTodos(AppState.completeTodos.items);
    },

    completedItemsCount: (el) => {

      const badge = el as HTMLToolbarBadgeElement;

      // Actions => Methods
      [ Actions.todoItemDeleted, 
        Actions.todoItemChecked, 
        Actions.todoItemUnchecked ].map((n)=>SO.setCallbackForActions(n,
        () => badge.setContent(AppState.completeTodos.count)));
        
        
      // Set initial component state
      badge.setContent(AppState.completeTodos.count);
    }
  }

  async componentWillLoad() {

    await App.initialize();

    SO.setRootElement(this.el);

    // Events => Actions
    [ 'onTodoItemCreated' ].map((n)=>SO.setHandlerForEvents(n,
      (ev) => App.handleTodoItemAdded(ev)));
    [ 'onTodoItemCheckedChanged' ].map((n)=>SO.setHandlerForEvents(n,
      (ev) => App.handleTodoItemCheckedChanged(ev)));
    [ 'onTodoItemDeleted' ].map((n)=>SO.setHandlerForEvents(n,
      (ev) => App.handleTodoItemDeleted(ev)));

  }

  // As elements are added to the DOM, this handler picks out certain ones, 
  // identified by the element's ID property, and then registers 
  // Events=>Actions and Actions=>Methods mappings for the element/web component.
  @Listen('DOMNodeInserted', { target: 'document' })
  handleDomNodeInserted(event: any) {

    if (!event.relatedNode) {
      console.log('Event does not contain relatedNode property.');
    };

    const element = event.relatedNode;
    
    if (this.switchboard.hasOwnProperty(element.id)) {

      console.log(`%c Get config for element: ${element.id}`, 'background: #222; color: blue');
      this.switchboard[element.id](element);
    }
  }

  @Listen('DOMNodeRemoved', { target: 'document' })
  handleDomNodeRemoved(_event: any) {

    //TODO: Unregister element events and methods from state management
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
