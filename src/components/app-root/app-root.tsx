import { Component, h, Element, Listen } from '@stencil/core';
import { SB } from '../../state/switchboard-operator';
import { Actions, AppStateController } from '../../state/app-state';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  @Element() el: HTMLAppRootElement;

  appState: AppStateController = new AppStateController();

  switchboard = {

    incompleteItemsList: (el: HTMLTodoListElement) => {

      // Actions => Methods
      [ Actions.todoItemAdded, 
        Actions.todoItemDeleted, 
        Actions.todoItemChecked, 
        Actions.todoItemUnchecked ].map((n)=>SB.setCallbackForActions(n,
        ()=>el.setTodos(this.appState.getAppState().incompleteTodos.items), el.id));

      // Set initial component state
      el.setTodos(this.appState.getAppState().incompleteTodos.items);
    },

    incompleteItemsCount: (el: HTMLToolbarBadgeElement) => {

      // Actions => Methods
      [ Actions.todoItemAdded, 
        Actions.todoItemDeleted, 
        Actions.todoItemChecked, 
        Actions.todoItemUnchecked ].map((n)=>SB.setCallbackForActions(n,
        ()=>el.setContent(this.appState.getAppState().incompleteTodos.count), el.id));
        
      // Set initial component state
      el.setContent(this.appState.getAppState().incompleteTodos.count);
    },

    completedItemsList: (el: HTMLTodoListElement) => {

      // Actions => Methods
      [ Actions.todoItemDeleted, 
        Actions.todoItemUnchecked ].map((n)=>SB.setCallbackForActions(n,
        ()=>el.setTodos(this.appState.getAppState().completeTodos.items), el.id));

      // Set initial component state
      el.setTodos(this.appState.getAppState().completeTodos.items);
    },

    completedItemsCount: (el: HTMLToolbarBadgeElement) => {

      // Actions => Methods
      [ Actions.todoItemDeleted, 
        Actions.todoItemChecked, 
        Actions.todoItemUnchecked ].map((n)=>SB.setCallbackForActions(n,
        ()=>el.setContent(this.appState.getAppState().completeTodos.count), el.id));
      
      // Set initial component state
      el.setContent(this.appState.getAppState().completeTodos.count);
    }
  }

  async componentWillLoad() {

    await this.appState.initialize();

    SB.setRootElement(this.el);

    // Event/s => Action mapping
    [ 'onTodoItemCreated' ].map((n)=>SB.setHandlerForEvents(n,
      (ev) => this.appState.handleTodoItemAdded(ev)));
      
    [ 'onTodoItemCheckedChanged' ].map((n)=>SB.setHandlerForEvents(n,
      (ev) => this.appState.handleTodoItemCheckedChanged(ev)));

    [ 'onTodoItemDeleted' ].map((n)=>SB.setHandlerForEvents(n,
      (ev) => this.appState.handleTodoItemDeleted(ev)));

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

      console.log(`%c Get config for element: ${element.id}`, 'background-color: #222; color: lightblue');
      this.switchboard[element.id](element);
    }
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
