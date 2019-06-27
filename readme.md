# About this project

This actual "To-Do" example application is a progressive web app built using Stencil and Ionic components.

The purpose of the project, however, is to attempt and refine application state management using a pattern I'm calling a "switchboard."

## Project Goals

* Web Component Reusability

Web components are an awesome concept, and should be able to be shared with the world easily. However, existing state management solutions often impose themselves onto web components with their property and action mapping (from what I've seen and understand with my limited experience) in such a way that makes them very difficult if not impossible to actually reuse in another project, especially if the other project doesn't use the same state management solution.

* Focus on App "Data" State Management, not "UI" State Management

Some state management solutions tend to throw UI state in with app data state, which is good because it allows for sequences of events to happen to both the data and UI that helps the user understand what is happening to the data. However, I don't believe this is a good idea because it makes it difficult to know what state, exactly, should be persisted between user sessions.

* Utilize Well-Supported Events and Listeners

There are some aspects of this pattern that feel like a publish/subscribe pattern, but the main reason I'm calling it a "switchboard" instead is because individual web components do absolutely nothing to "subscribe" to events; it's all handled outside of the web components, possibly within a higher-level root component. 

## Getting Started

If you want to help in the development effort of this project, start by cloning this report to a new directory:

```bash
git clone https://github.com/gopherrdiggs/diggs-todo-switchboard.git
```

Then run the following to install all required dependencies:

```bash
npm install
```

Finally, launch the app using:

```bash
npm start
```