import { Subject } from 'rxjs';
import { Stream } from 'xstream';

export type ScrollSink = {
  offsetTop: number;
};

export function makeScrollDriver() {
  return function ScrollDriver(sink$: Stream<ScrollSink>): Subject<string> {
    sink$.addListener({
      next: (sink: ScrollSink) => window.scrollTo(0, sink.offsetTop),
    });

    const source$ = new Subject<string>();
    window.addEventListener('scroll', () => {
      source$.next(`${window.scrollY}px`);
    });

    return source$;
  };
}
