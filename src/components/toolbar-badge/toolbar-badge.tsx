import { Component, h, State, Method } from "@stencil/core";

@Component({
  tag: 'toolbar-badge'
})
export class ToolbarBadge {

  @State() _content: number = 0;

  @Method()
  async setContent(content: number) {

    this._content = content;
  }

  render() {
    return [
      <ion-item color='transparent' lines='none'>
        <ion-badge color='light'>
          {this._content}
        </ion-badge>
      </ion-item>
    ];
  }
}