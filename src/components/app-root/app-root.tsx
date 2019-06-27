import { Component, h, Element, Listen } from '@stencil/core';
import { SwitchboardOperator } from '../../state/switchboard-operator';
import { AppStateController, AppState, Actions } from '../../state/app-state';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  @Element() el: HTMLAppRootElement;

  async componentWillLoad() {

    await AppStateController.initializeController();
    SwitchboardOperator.setRootElement(this.el);
  }

  // As elements are added to the DOM, this method picks out certain ones, identified by the element's ID property,
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
        SwitchboardOperator.registerElementEventToStateActionHandler(
          'onTodoItemCheckedChanged', 
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
        SwitchboardOperator.registerStateActionToElementCallback(
          Actions.todoItemAdded,
          () => list.setTodos(AppState.incompleteTodos.items)
        );
        // Set initial component state
        list.setTodos(AppState.incompleteTodos.items);
        break;
      }

      case 'completedItemsList': {

        const list = element as HTMLTodoListElement;
        // Events => Actions
        SwitchboardOperator.registerElementEventToStateActionHandler(
          'onTodoItemCheckedChanged', 
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

        const badge = element as HTMLToolbarBadgeElement;
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
        SwitchboardOperator.registerStateActionToElementCallback(
          Actions.todoItemAdded,
          () => badge.setContent(AppState.incompleteTodos.count)
        );
        // Set initial component state
        badge.setContent(AppState.incompleteTodos.count);
        break;
      }

      case 'completedItemsCount': {

        const badge = element as HTMLToolbarBadgeElement;
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

      case 'addTodoModal': {

        console.log("registering event-action mapping for modal");
        // Events => Actions
        SwitchboardOperator.registerElementEventToStateActionHandler(
          'onTodoItemCreated',
          (e) => AppStateController.handleTodoItemCreated(e)
        );
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
