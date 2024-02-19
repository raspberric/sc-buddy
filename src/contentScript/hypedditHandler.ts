import { waitForSomething } from '../utils/waiter';

export enum HypedditStep {
  EMAIL = 'EMAIL',
  COMMENT = 'COMMENT',
  IG = 'IG',
  DOWNLOAD = 'DOWNLOAD',
  INITIAL = 'INITIAL',
}

export class HypedditHandler {
  constructor(private content: HTMLElement) {}

  async getTrack() {
    if (this.getCurrentStep() === HypedditStep.INITIAL) {
      this.clickDownloadButton();
      await this.waitForStepChange(HypedditStep.INITIAL);
    }
    if (this.getCurrentStep() === HypedditStep.EMAIL) {
      this.addEmail();
      await this.waitForStepChange(HypedditStep.EMAIL);
    }
    if (this.getCurrentStep() === HypedditStep.COMMENT) {
      this.addComment();
      await this.waitForStepChange(HypedditStep.COMMENT);
    }
    if (this.getCurrentStep() === HypedditStep.IG) {
      this.handleIg();
      await this.waitForStepChange(HypedditStep.IG);
    }

    if (this.getCurrentStep() === HypedditStep.DOWNLOAD) {
      this.downloadTrack();
    }
  }

  private downloadTrack() {
    (this.content.querySelector('.free_dwln') as HTMLAnchorElement).click();
  }

  private getZindex(selector: string) {
    const element = this.content.querySelector(selector);

    if (!element) {
      return -1;
    }

    return parseInt(getComputedStyle(element).zIndex);
  }

  private async waitForStepChange(currentStep: HypedditStep) {
    return waitForSomething(() => this.getCurrentStep() !== currentStep);
  }

  private getCurrentStep(): HypedditStep {
    const isCarouselVisible =
      getComputedStyle(
        this.content.querySelector('#myCarousel') as HTMLDivElement,
      ).display !== 'none';

    if (isCarouselVisible) {
      if (this.getZindex('#all_steps .email') >= 0) {
        return HypedditStep.EMAIL;
      }
      if (this.getZindex('#all_steps .sc') >= 0) {
        return HypedditStep.COMMENT;
      }
      if (this.getZindex('#all_steps .ig') >= 0) {
        return HypedditStep.IG;
      }
      if (this.getZindex('#all_steps .dw') >= 0) {
        return HypedditStep.DOWNLOAD;
      }
    }
    return HypedditStep.INITIAL;
  }

  private async addEmail() {
    const emailName = this.content.querySelector('#email_name');
    if (emailName) {
      (emailName as HTMLInputElement).value = 'Nikola';
    }
    (this.content.querySelector('#email_address') as HTMLInputElement).value =
      'expone1@gmail.com';
    (
      this.content.querySelector(
        '#email_to_downloads_next',
      ) as HTMLButtonElement
    ).click();
  }

  private addComment() {
    const commentInput = this.content.querySelector('#sc_comment_text');
    if (commentInput) {
      (commentInput as HTMLInputElement).value = 'fire';
    }

    const button = this.content.querySelector(
      '#login_to_sc',
    ) as HTMLButtonElement;

    const buttonUrl = button.getAttribute('data-onclick') || button.getAttribute('onclick');

    window.open(
      buttonUrl!.split("'")[1],
      '',
      'width=1,height=1,scrollbars=0,resizable=0,toolbar=0,location=0,menubar=0,status=0,directories=0',
    );
  }

  private handleIg() {
    this.content
      .querySelectorAll('#instagram_status a.button')
      .forEach((button) => (button as HTMLAnchorElement).click());

    (
      this.content.querySelector('#skipper_ig_next') as HTMLButtonElement
    ).click();
  }

  private clickDownloadButton() {
    const downloadButton = this.content.querySelector(
      '#downloadProcess',
    ) as HTMLButtonElement;
    downloadButton.click();
  }
}
