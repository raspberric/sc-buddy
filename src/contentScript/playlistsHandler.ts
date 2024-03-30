import { Waiter } from '../utils/waiter';

export interface PlaylistItem {
  name: string;
  path: string;
}

export class PlaylistsHandler {
  static LIST_SELECTOR = '.lazyLoadingList__list';
  static LIST_ITEM_SELECTOR = '.playableTile__description';
  static PLAYLISTS_STORAGE_KEY = 'playlists';

  private waiter: Waiter;
  playlistItems: PlaylistItem[] = [];

  constructor(
    private content: Element,
    waiter?: Waiter,
  ) {
    this.waiter = waiter || new Waiter();
  }

  async saveToStorage() {
    return chrome.storage.local.set({
      [PlaylistsHandler.PLAYLISTS_STORAGE_KEY]: this.playlistItems,
    });
  }

  async loadPlaylistItems() {
    this.playlistItems = await this.getPlaylistItems(this.content);
    return this.playlistItems;
  }

  private async getPlaylistItems(content: Element) {
    const list = await this.waiter.waitForElement(
      content,
      PlaylistsHandler.LIST_SELECTOR,
    );

    const playlists = await this.waiter.waitForAllElements(
      list,
      PlaylistsHandler.LIST_ITEM_SELECTOR,
    );

    return playlists.map((element) => this.getPlaylistItemFromElement(element));
  }

  private getPlaylistItemFromElement(element: Element): PlaylistItem {
    const anchor = element.querySelector('a');
    return {
      name: anchor?.innerText || '',
      path: anchor?.getAttribute('href') || '',
    };
  }

  // TODO: implement playlist parsing
  async getPlaylistItemsUrls(path: string): Promise<string[]> {
    const playlistPage = await this.parsePlaylist(path);
    console.log(playlistPage);

    return [];
  }

  // @ts-ignore
  private async parsePlaylist(path: string) {
    // ### this could work if you can figure out how to get playlist/track ids
    // const bodyText = await fetch(
    //   'https://api-v2.soundcloud.com/tracks?ids=1428048928&client_id=8BBZpqUP1KSN4W6YB64xog2PX4Dw98b1&%5Bobject%20Object%5D=',
    // ).then((response) => response.json());
    // console.log(bodyText);
    // ### below is a dead end - tried parsing <noscripts>
    // const domParser = new DOMParser();
    // const playlistDocument = domParser.parseFromString(bodyText, 'text/html');
    // const trackList = playlistDocument.querySelector('noscript .tracklist');
    // if (!trackList) {
    //   throw new UnrecoverableError('No tracklist item found');
    // }
    // const tracks = [
    //   ...trackList.querySelectorAll('a[itemprop="url"]').values(),
    // ].map((anchor) => ({
    //   name: anchor.textContent,
    //   url: anchor.getAttribute('href'),
    // }));
    // console.log(tracks);
  }
}
