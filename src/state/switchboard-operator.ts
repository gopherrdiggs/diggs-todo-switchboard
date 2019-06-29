interface ActionCallbackRegistry {
  callbacks: {}
}

class SwitchboardController {

  rootElement: HTMLElement;

  // State Actions => Element Methods
  actionCallbacks = {} as ActionCallbackRegistry;

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

  setHandlerForEvents(eventName: string, actionHandler: Function) {

    this.rootElement.addEventListener(eventName, (event: any) => actionHandler(event));
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