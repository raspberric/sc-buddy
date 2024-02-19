import { UnrecoverableError } from '../utils/error';
import { waitForSomething } from '../utils/waiter';
import { HypedditHandler } from './hypedditHandler';
import { isOnHypeddit, isOnSecureSc } from './locators';
import { PlaylistsHandler } from './playlistsHandler';
import { TrackHandler } from './trackHandler';

// const pathName = window.location.pathname;
const origin = window.location.origin;

try {
  if (isOnHypeddit(origin)) {
    downloadFromHypeddit(document.querySelector('.release-content'));
  }

  if (isOnSecureSc(origin)) {
    authorizeSc();
  }
} catch (e) {
  console.error(e);
}

async function authorizeSc() {
  const container = document.querySelector('#app');
  const button = await waitForSomething(() =>
    container?.querySelector('#submit_signup'),
  );

  if (!button) {
    throw new UnrecoverableError('No continue button on SC secure!');
  }
  (button as HTMLButtonElement).click();
}

function downloadFromHypeddit(content: HTMLElement | null) {
  if (!content) {
    throw new UnrecoverableError(
      'No content found! This might be a change on SC end, check content selector',
    );
  }

  const hypedditHandler = new HypedditHandler(content);
  hypedditHandler.getTrack();
}

async function preparePlaylists(content: Element | null) {
  if (!content) {
    throw new UnrecoverableError(
      'No content found! This might be a change on SC end, check content selector',
    );
  }

  const playlistsHandler = new PlaylistsHandler(content);
  const playlistItems = await playlistsHandler.loadPlaylistItems();

  if (!playlistItems) {
    throw new UnrecoverableError('No playlists found!');
  }
  // await playlistsHandler.saveToStorage();
  playlistsHandler.getPlaylistItemsUrls(playlistsHandler.playlistItems[4].path);
}

async function downloadTrack(content: Element | null) {
  if (!content) {
    throw new UnrecoverableError(
      'No content found! This might be a change on SC end, check content selector',
    );
  }

  const trackHandler = new TrackHandler(content);
  trackHandler.downloadTrack();
}
