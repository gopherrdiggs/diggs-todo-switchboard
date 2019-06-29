interface ActionCallbackRegistry {
  callbacks: {}
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

  // State Actions => Element Methods
  actionCallbacks = {} as ActionCallbackRegistry;

  // Element Events => State Action Handlers
  elementEventToStateActionHandlerRegistry = {} as ElementEventToStateActionHandlerRegistry;

  constructor() {

    this.elementEventToStateActionHandlerRegistry.registry = [];
  }

  key(o) { return btoa(o); }

  setRootElement(rootElement: HTMLElement) {

    this.rootElement = rootElement;
  }

  setCallbackForActions(actionName: string, method: Function, elementId: string = 'any') {

    let methodKey = this.key(elementId + method);
    let reg = this.actionCallbacks[actionName];

    if (!reg) {
      this.actionCallbacks[actionName] = {
        callbacks: {}
      };
    }

    this.actionCallbacks[actionName].callbacks[methodKey] = method;
  }

  removeCallbacks(_elementId: string) {
    // console.log(`Removing callbacks for ${elementId}`);

    // this.stateActionToElementMethodRegistry.registry =
    //   this.stateActionToElementMethodRegistry.registry.filter(r => {
    //     if (r.elementId && r.elementId == elementId) {
    //       console.log(`Removing callback for ${elementId}`);
    //     }
    //     return r.elementId && r.elementId != elementId;
    //   });
  }

  setHandlerForEvents(eventName: string, actionHandler: Function, sourceElementId?: string) {
    let registration = this.elementEventToStateActionHandlerRegistry.registry.find(r => {
      if (sourceElementId) {
        return r.eventName === eventName && r.sourceElementId === sourceElementId;
      }
      return r.eventName === eventName;
    });

    if (registration) {
      // Handler already registered for this event
      return; 
    }

    // Registry entry does not exist, create it.
    this.elementEventToStateActionHandlerRegistry.registry.push({
      eventName: eventName,
      actionHandler: actionHandler,
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

    let reg = this.actionCallbacks[actionName];

    if (!reg) {
      throw new Error(`Registration for action ${actionName} not found.`);
    }

    for (let methodKey in reg.callbacks) {
      await reg.callbacks[methodKey]();
    }
  }

}

export const SO = new SwitchboardController();