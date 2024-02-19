import { UnrecoverableError } from '../utils/error';
import { Waiter, waitForSomething } from '../utils/waiter';
import { HypedditHandler } from './hypedditHandler';
import { isOnHypeddit, isOnSc, isOnSecureSc } from './locators';
import { PlaylistsHandler } from './playlistsHandler';
import { TrackHandler } from './trackHandler';

const pathName = window.location.pathname;
const origin = window.location.origin;

try {
  if (isOnSc(origin)) {
    if (pathName === '/you/sets') {
      // preparePlaylists(document.querySelector('#content'));
    }
    if (!'on track page detect') {
      chrome.storage.local.onChanged.addListener((changes) => {
        console.log('storage changed', changes);
      });

      chrome.runtime.onMessage.addListener((message) => {
        console.log('background received message', message);
      });

      // chrome.storage.local
      //   .get([PlaylistsHandler.PLAYLISTS_STORAGE_KEY])
      //   .then((result) => {
      //     parsePlaylist(result[PlaylistsHandler.PLAYLISTS_STORAGE_KEY][1].path);
      // });

      // downloadTrack(document.querySelector('#content'));
    }
  }

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
