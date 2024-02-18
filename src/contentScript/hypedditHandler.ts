import { UnrecoverableError } from '../utils/error';

export class HypedditHandler {
  constructor(private content: HTMLElement) {}

  downloadTrack() {
    const downloadButton = this.findDownloadAnchor(this.content);
    // first stage
    if(downloadButton) {
      downloadButton.click();
    }

    this.addComment();
  }

  private addComment() {
    const commentInput = this.getCommentInput(this.content);
    const submitButtonUrl = this.getUrlFromSubmitButton(this.content);

    if (commentInput && submitButtonUrl) {
      commentInput.value = 'Fire!';
      window.open(submitButtonUrl);
    }
  }

  private getUrlFromSubmitButton(content: HTMLElement) {
    const button = content.querySelector('#login_to_sc');

    if (!button) {
      throw new UnrecoverableError('No login button on hypeddit!');
    }
    const buttonUrl = button.getAttribute('data-onclick');
    if (!buttonUrl) {
      throw new UnrecoverableError('No url on submit button on hypeddit!');
    }

    return buttonUrl.split("'")[1];
  }

  private getCommentInput(content: HTMLElement): HTMLInputElement {
    const input = content.querySelector('input#sc_comment_text');
    if (!input) {
      throw new UnrecoverableError('No comment input on hypeddit!');
    }

    return input as HTMLInputElement;
  }

  private findDownloadAnchor(container: HTMLElement): HTMLAnchorElement | null {
    return container.querySelector('#downloadProcess');
  }
}
