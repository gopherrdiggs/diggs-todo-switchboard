// interface IStateActionToElementFunctionMapping {
//   actionName: string,
//   callback: Function
// }

// interface IStateActionToElementFunctionMap {
//   elementId: string,
//   actionFunctionMap: IStateActionToElementFunctionMapping[]
// }

// interface IEventToStateHandlerMapping {
//   eventName: string,
//   callback: Function
// }

// interface IElementStateConfig {
//   elementId: string,
//   stateActionsToElementsFunctionsMap: IStateActionToElementFunctionMapping[],
//   eventsToStateHandlersMap: IEventToStateHandlerMapping[]
// }

// enum Actions {
//   todoItemChecked = 'todoItemChecked',
//   todoItemUnchecked = 'todoItemUnchecked'
// }

// const config: IElementStateConfig[] = [
//   {
//     elementId: "incompleteItemsList",
//     stateActionsToElementsFunctionsMap: [{
//         actionName: Actions.todoItemChecked,
//         callback: () => { } }
//     ],
//     eventsToStateHandlersMap: [{
//         eventName: "onItemCheckedChanged",
//         callback: () => { } }
//     ]
//   }
// ];

// class AppStateLogicController {

//   private rootElement: HTMLElement;
//   private actionCallbackRegistry = [] as IStateActionToElementFunctionMap[];

//   setRootElement(rootElement: HTMLElement) {

//     this.rootElement = rootElement;
    
//     this.rootElement.addEventListener('DOMNodeInserted', (event: any) => {

//       if (!event.relatedNode) {
//         console.log('Event does not contain relatedNode property.');
//       };
  
//       let element = event.relatedNode;

//       // Determine if node being added has a registration config
//       let elementRegistration = config.find(c => {
//         return c.elementId === element.id;
//       })

//       if (!elementRegistration) return;

//       //TODO: Determine if callback needs to be attached dynamically to element

//       for (let actionFunctionMapping of elementRegistration.stateActionsToElementsFunctionsMap) {
//         this.registerStateActionToElementFunction(
//           elementRegistration.elementId,
//           actionFunctionMapping.actionName,
//           actionFunctionMapping.callback);
//       }

//       for (let eventHandlerMapping of elementRegistration.eventsToStateHandlersMap) {
//         this.registerElementEventToStateActionHandler(
//           eventHandlerMapping.eventName,
//           eventHandlerMapping.callback);
//       }
//     })
//   }

//   //TODO: Handle each registration when node is added (see setRootElement)
//   //TODO: Remove initializeMapping function;
//   // async initializeMapping() {

//   //   for (let elementConfig of config) {

//   //     for (let actionFuncMapping of elementConfig.stateActionsToElementsFunctionsMap) {

//   //       this.registerStateActionToElementFunction(
//   //         elementConfig.elementId, 
//   //         actionFuncMapping.actionName, 
//   //         actionFuncMapping.callback);
//   //     }

//   //     for (let eventHandlerMapping of elementConfig.eventsToStateHandlersMap) {

//   //       this.registerElementEventToStateActionHandler(
//   //         eventHandlerMapping.eventName,
//   //         eventHandlerMapping.callback);
//   //     }
//   //   }
//   // }

//   async registerStateActionToElementFunction(
//     elementId: string, actionName: string, callback: Function) {

//     let elemActionCallbacks = this.actionCallbackRegistry.find(e => {
//       return e.elementId === elementId
//     });

//     if (!elemActionCallbacks) {
      
//       this.actionCallbackRegistry.push({
//         elementId: elementId,
//         actionFunctionMap: []
//       });

//       elemActionCallbacks = this.actionCallbackRegistry.find(e => {
//         return e.elementId === elementId
//       });
//     }

//     let actionCallbackRegistration = elemActionCallbacks.actionFunctionMap.find(f => {
//       return f.actionName === actionName;
//     });

//     if (!actionCallbackRegistration) {

//       elemActionCallbacks.actionFunctionMap.push({
//         actionName: actionName,
//         callback: callback
//       });
//     }
//   }

//   async registerElementEventToStateActionHandler(
//     eventName: string, callback: Function) {

//     this.rootElement.addEventListener(eventName, (event: any) => { callback(event) });
//   }

//   async executeElementCallbacksForAction(actionName: string) {

//     console.log('Executing callback for action: ', actionName);

//     for (let registryItem of this.actionCallbackRegistry) {

//       for (let cbMapping of registryItem.actionFunctionMap) {

//         if (cbMapping.actionName === actionName) {

//           // console.log(`Calling ${cbMapping.callback.toString()} on ${registryItem.elementId}`);
//           // await cbMapping.callback();
//         }
//       }
//     }
//   }
// }

// export const AppStateController = new AppStateLogicController();