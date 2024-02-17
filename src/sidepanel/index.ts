import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  PlaylistItem,
  PlaylistsHandler,
} from '../contentScript/playlistsHandler';
import './playlistItem';

@customElement('sidepanel-root')
export class Sidepanel extends LitElement {
  @state()
  playlists: PlaylistItem[] = [];

  constructor() {
    super();
    chrome.storage.local
      .get([PlaylistsHandler.PLAYLISTS_STORAGE_KEY])
      .then((value) => {
        this.playlists = value[PlaylistsHandler.PLAYLISTS_STORAGE_KEY];
      });
    chrome.storage.local.onChanged.addListener((changes) => {
      const playlistChange = changes[PlaylistsHandler.PLAYLISTS_STORAGE_KEY];
      this.playlists = playlistChange.newValue;
      console.log(this.playlists);
    });
  }

  render() {
    return html`
      <div>
        ${this.playlists.map(
          (playlist) => html`
            <scb-playlist
              link="${playlist.path}"
              name="${playlist.name}"
            ></scb-playlist>
          `,
        )}
      </div>
    `;
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    'sidepanel-root': Sidepanel;
  }
}
