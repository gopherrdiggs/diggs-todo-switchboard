
interface StateActionToElementCallbackMapping {
  actionName: string,
  elementMethods: Function[]
}

interface StateActionToElementCallbackRegistry {
  registry: StateActionToElementCallbackMapping[]
}

interface ElementEventToStateActionHandlerMapping {
  eventName: string,
  actionHandler: Function,
  sourceElementId?: string
}

interface ElementEventToStateActionHandlerRegistry {
  registry: ElementEventToStateActionHandlerMapping[]
}

class SwitchboardController {

  rootElement: HTMLElement;
  stateActionToElementMethodRegistry = {} as StateActionToElementCallbackRegistry;
  elementEventToStateActionHandlerRegistry = {} as ElementEventToStateActionHandlerRegistry;

  constructor() {

    this.stateActionToElementMethodRegistry.registry = [];
    this.elementEventToStateActionHandlerRegistry.registry = [];
  }

  setRootElement(rootElement: HTMLElement) {

    this.rootElement = rootElement;
  }

  async registerStateActionsToElementCallback(
    actionNames: string[], method: Function) {
    
    for (let actionName of actionNames) {
      await this.registerStateActionToElementCallback(actionName, method);
    }
  }

  // Add to the list of callback functions/methods that are called when an action occurs.
  async registerStateActionToElementCallback(
    actionName: string, method: Function) {

    let registration = this.stateActionToElementMethodRegistry.registry.find(r => {
      return r.actionName === actionName;
    });

    if (!registration) {
      // Registry entry does not exist, create it.
      this.stateActionToElementMethodRegistry.registry.push({
        actionName: actionName,
        elementMethods: []
      });

      registration = this.stateActionToElementMethodRegistry.registry.find(r => {
        return r.actionName === actionName;
      });
    }

    //TODO: Ensure the exact same method is not registered more than once.
    registration.elementMethods.push(method);
  }

  async registerElementEventsToStateActionHandler(
    eventNames: string[], handler: Function, sourceElementId?: string) {
    
    for (let eventName of eventNames) {
      await this.registerElementEventToStateActionHandler(eventName, handler, sourceElementId);
    }
  }

  // Configure which action handler is called when an event occurs.
  async registerElementEventToStateActionHandler(
    eventName: string, handler: Function, sourceElementId?: string) {

    let registration = this.elementEventToStateActionHandlerRegistry.registry.find(r => {
      if (sourceElementId) {
        return r.eventName === eventName && r.sourceElementId === sourceElementId;
      }
      return r.eventName === eventName;
    });

    if (registration) {
      return; //TODO: Revert back to throwing error once elements are un-registered when removed from DOM
      // throw new Error("ERROR: Event registered to action handler more than once. Did you mean to register events based on element IDs?");
    }

    // Registry entry does not exist, create it.
    this.elementEventToStateActionHandlerRegistry.registry.push({
      eventName: eventName,
      actionHandler: handler,
      sourceElementId: sourceElementId
    });

    // Select the registration just created
    registration = this.elementEventToStateActionHandlerRegistry.registry.find(r => {
      if (sourceElementId) {
        return r.eventName === eventName && r.sourceElementId === sourceElementId;
      }
      return r.eventName === eventName;
    });

    // Set up event listener on root element provided
    this.rootElement.addEventListener(eventName, (event: any) => {
      console.log("Event occurred: ", event);
      if (sourceElementId) {
        if (!event.target || event.target.id != sourceElementId) return;
      }

      console.log("Calling action handler: ", registration.actionHandler.toString());
      registration.actionHandler(event);
    });
  }
  
  async executeElementCallbacksForStateAction(actionName: string) {

    console.log('Executing methods associated with actionName: ', actionName);;
    let actionRegistration = this.stateActionToElementMethodRegistry.registry.find(r => {
      return r.actionName === actionName;
    });

    if (!actionRegistration) {
      throw new Error("ERROR: Unable to find registration for action: " + actionName);
    }

    for (let method of actionRegistration.elementMethods) {
      console.log('Executing method ', method.toString());
      await method();
    }
  }
}

export const SwitchboardOperator = new SwitchboardController();