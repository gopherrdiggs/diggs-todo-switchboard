
interface StateActionToElementCallbackMapping {
  actionName: string,
  elementMethods: Function[],
  elementId?: string
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

  setCallbackForActions(actionName: string, method: Function, elementId?: string) {

    // Get an existing registration, if one exists
    let existingRegistration = this.stateActionToElementMethodRegistry.registry.find(r => {

      if (elementId) {
        return r.elementId == elementId && r.actionName == actionName;
      }
      return r.actionName == actionName;
    });

    // Do not register the same callback multiple times
    if (existingRegistration) { return };
 
    let registration = this.stateActionToElementMethodRegistry.registry.find(r => {
      return r.actionName == actionName;
    });

    if (!registration) {
      // Registry entry does not exist, create it.
      this.stateActionToElementMethodRegistry.registry.push({
        actionName: actionName,
        elementMethods: [],
        elementId
      });

      registration = this.stateActionToElementMethodRegistry.registry.find(r => {
        return r.actionName === actionName;
      });
    }

    console.log(`Registering method: ${method.toString()} for action: ${actionName}`);
    registration.elementMethods.push(method);
  }

  removeCallbacks(elementId: string) {
    console.log(`Removing callbacks for ${elementId}`);

    this.stateActionToElementMethodRegistry.registry =
      this.stateActionToElementMethodRegistry.registry.filter(r => {
        if (r.elementId && r.elementId == elementId) {
          console.log(`Removing callback for ${elementId}`);
        }
        return r.elementId && r.elementId != elementId;
      });
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

export const SO = new SwitchboardController();