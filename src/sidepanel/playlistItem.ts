import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('scb-playlist')
export class Playlist extends LitElement {
  @property()
  link = '';

  @property()
  name = '';

  render() {
    return html`<div class="wrapper">
      <span class="name">${this.name}</span>
      <span>
        <button @click="${this.download}">download</button>
      </span>
    </div> `;
  }

  static styles = css`
    :host {
      margin-bottom: 10px;
    }
  `;

  private download() {
    console.log(this.link);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scb-playlist': Playlist;
  }
}
