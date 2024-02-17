import { Waiter } from '../utils/waiter';

export interface PlaylistItem {
  name: string;
  path: string;
}

export class PlaylistsHandler {
  static LIST_SELECTOR = '.lazyLoadingList__list';
  static LIST_ITEM_SELECTOR = '.playableTile__description';

  private waiter: Waiter;
  playlistItems: PlaylistItem[] = [];

  constructor(
    private content: Element,
    waiter?: Waiter,
  ) {
    this.waiter = waiter || new Waiter();
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
}
