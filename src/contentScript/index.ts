import { UnrecoverableError } from '../utils/error';
import { PlaylistsHandler } from './playlistsHandler';

const pathName = window.location.pathname;

try {
  if (pathName === '/you/sets') {
    preparePlaylists();
  }
} catch (e) {
  console.error(e);
}

async function preparePlaylists() {
  const content = document.querySelector('#content');
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

  await playlistsHandler.saveToStorage();
}
