export class Waiter {
  constructor(
    private interval = 100,
    private countLimit = 10,
  ) {}

  async waitForElement(container: Element, selector: string): Promise<Element> {
    let counter = 0;
    let element = null;

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        element = container.querySelector(selector);

        if (element) {
          clearInterval(intervalId);
          resolve(element);
        }
        if (counter === this.countLimit) {
          reject(
            'No element found! Check element selector or increase timeout!',
          );
        }

        counter++;
      }, this.interval);
    });
  }

  async waitForAllElements(
    container: Element,
    selector: string,
  ): Promise<Element[]> {
    let elementCount = 0;
    let counter = 0;

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        const currentElements = container.querySelectorAll(selector);

        if (
          currentElements.length >= elementCount &&
          counter > this.countLimit
        ) {
          clearInterval(intervalId);

          if (!currentElements.length) {
            reject(
              'No elements found! Check elements selector or increase timeout!',
            );
          } else {
            resolve([...currentElements]);
          }
        }

        counter++;
      }, this.interval);
    });
  }
}
