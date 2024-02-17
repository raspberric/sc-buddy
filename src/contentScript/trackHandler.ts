import { UnrecoverableError } from '../utils/error';

export class TrackHandler {
  constructor(private content: Element) {}

  downloadTrack() {
    const downloadLink = this.getDownloadLink(this.content);

    if (!downloadLink) {
      throw new UnrecoverableError('No download link found :(');
    }

    this.openDownloadLink(downloadLink);
  }

  private openDownloadLink(downloadLink: string) {
    window.open(downloadLink);
  }

  private getDownloadLink(content: Element) {
    const actionsBar = content.querySelector('.soundActions');
    if (!actionsBar) {
      throw new UnrecoverableError('No actions bar found!');
    }

    const anchors = [...actionsBar?.querySelectorAll('a').values()];
    const dlAnchor = this.findDownloadAnchor(anchors);
    return dlAnchor?.getAttribute('href');
  }

  private findDownloadAnchor(anchors: Element[]): Element | undefined {
    return anchors.find((anchor) => {
      const anchorText = anchor.textContent?.toLowerCase();

      return (
        anchorText &&
        (anchorText.includes('buy') ||
          anchorText.includes('dl') ||
          anchorText.includes('download'))
      );
    });
  }
}
