import Chainable from '../chainable';
import createObserver from '../chainable/observer';
import { Observer, ObserverCandidate } from '../chainable/types';

export abstract class BaseReaction<T> extends Chainable<T> {
  private subscribers: Observer[] = [];
  private isActive = true;

  complete(): void {
    this.isActive = false;
    this.subscribers.forEach((subscriber) => subscriber.complete());
  }

  error(err: any): void {
    this.isActive = false;
    this.subscribers.forEach((subscriber) => subscriber.error(err));
  }

  update(v: any) {
    if (!this.isActive) return;
    for (let i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i].update(v);
    }
  }

  subscribe(observerCandidate: ObserverCandidate) {
    const observer = createObserver(observerCandidate, this.props);
    this.subscribers.push(observer);

    return {
      unsubscribe: () => {
        const index = this.subscribers.indexOf(observer);
        if (index !== -1) this.subscribers.splice(index, 1);
      }
    };
  }
}
