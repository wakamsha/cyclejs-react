import { from, Observable, ObservableInput } from 'rxjs';
import { Stream } from 'xstream';

export namespace Rx {
  /**
   * xstream の Stream を RxJS の Observable へ変換します
   * @param {Stream<U>} stream
   */
  export function O<T, U>(stream: Stream<U>): Observable<T> {
    return from<ObservableInput<T>>((stream as unknown) as ObservableInput<T>);
  }
}
