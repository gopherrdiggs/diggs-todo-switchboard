import { Component, h, Element, Listen } from '@stencil/core';
import { SO } from '../../state/switchboard-operator';
import { App, AppState, Actions } from '../../state/app-state';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  @Element() el: HTMLAppRootElement;

  async componentWillLoad() {

    await App.initializeController();
    SO.setRootElement(this.el);
  }

  // As elements are added to the DOM, this handler picks out certain ones, identified by the element's ID property,
  // then registers Events=>Actions and Actions=>Methods mappings for the element (web component)
  // Obviously, the registration of all these elements and callbacks doesn't scale well for a single file like this,
  // so any ideas on how to organize this logic - maybe based on domain - would be appreciated.
  @Listen('DOMNodeInserted', { target: 'document' })
  handleDomNodeInserted(event: any) {

    if (!event) return;

    if (!event.relatedNode) {
      console.log('Event does not contain relatedNode property.');
    };

    const element = event.relatedNode;

    switch (element.id) {

      case 'incompleteItemsList': {

        const list = element as HTMLTodoListElement;

        // Events => Actions
        [ 'onTodoItemCheckedChanged' ].map((n)=>SO.setHandlerForEvents(n,
          (ev) => App.handleTodoItemCheckedChanged(ev), element.id));

        [ 'onTodoItemDeleted' ].map((n)=>SO.setHandlerForEvents(n,
          (ev) => App.handleTodoItemDeleted(ev), element.id));

        // SO.registerElementEventToStateActionHandler(
        //   'onTodoItemCheckedChanged', (e) => App.handleTodoItemCheckedChanged(e), list.id);
        // SO.registerElementEventToStateActionHandler(
        //   'onTodoItemDeleted', (e) => App.handleTodoItemDeleted(e), list.id);

        // Actions => Methods
        [ Actions.todoItemAdded, 
          Actions.todoItemDeleted, 
          Actions.todoItemChecked, 
          Actions.todoItemUnchecked ].map((n)=>SO.setCallbackForActions(n,
          ()=>list.setTodos(AppState.incompleteTodos.items)));

        // SswitchboardOperator.registerStateActionsToElementCallback(
        //   [ Actions.todoItemAdded, Actions.todoItemDeleted, 
        //     Actions.todoItemChecked, Actions.todoItemUnchecked ],
        //   () => list.setTodos(AppState.incompleteTodos.items)
        // );

        // Set initial component state
        list.setTodos(AppState.incompleteTodos.items);
        break;
      }

      case 'completedItemsList': {

        const list = element as HTMLTodoListElement;

        // Events => Actions
        [ 'onTodoItemCheckedChanged' ].map((n)=>SO.setHandlerForEvents(n,
          (ev) => App.handleTodoItemCheckedChanged(ev), element.id));

        [ 'onTodoItemCheckedChanged' ].map((n)=>SO.setHandlerForEvents(n,
          (ev) => App.handleTodoItemCheckedChanged(ev), element.id));

        // Actions => Methods
        [ Actions.todoItemDeleted, 
          Actions.todoItemUnchecked ].map((n)=>SO.setCallbackForActions(n,
          ()=>list.setTodos(AppState.completeTodos.items)));

        // Set initial component state
        list.setTodos(AppState.completeTodos.items);
        break;
      }

      case 'incompleteItemsCount': {

        const badge = element as HTMLToolbarBadgeElement;

        // Events => Actions
        // ...none, this element/component fires no events

        // Actions => Methods
        [ Actions.todoItemAdded, 
          Actions.todoItemDeleted, 
          Actions.todoItemChecked, 
          Actions.todoItemUnchecked ].map((n)=>SO.setCallbackForActions(n,
          () => badge.setContent(AppState.incompleteTodos.count)));
          
        // Set initial component state
        badge.setContent(AppState.incompleteTodos.count);
        break;
      }

      case 'completedItemsCount': {

        const badge = element as HTMLToolbarBadgeElement;

        // Events => Actions
        // ...none, this element/component fires no events

        // Actions => Methods
        [ Actions.todoItemDeleted, 
          Actions.todoItemChecked, 
          Actions.todoItemUnchecked ].map((n)=>SO.setCallbackForActions(n,
          () => badge.setContent(AppState.completeTodos.count)));
          
          
        // Set initial component state
        badge.setContent(AppState.completeTodos.count);
        break;
      }

      case 'addTodoModal': {

        // Events => Actions
        [ 'onTodoItemCreated' ].map((n)=>SO.setHandlerForEvents(n,
          (ev) => App.handleTodoItemCreated(ev), element.id));
      }
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
