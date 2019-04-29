import { makeDOMDriver } from '@cycle/react-dom';
import { run } from '@cycle/rxjs-run';
import { Text, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { combineLatest, merge, Observable } from 'rxjs';
import { map, scan, share, startWith } from 'rxjs/operators';
import { Si as SiVote, VoteComponent } from './components/VoteComponent';
import { SiAll, SoAll } from './drivers/interface';
import { makeScrollDriver } from './drivers/ScrollDriver';
import {
  initialStore,
  makeUpdateNameAction,
  makeUpdateScrollValue,
  makeUpdateVoteAction,
  Store,
  StoreAction,
} from './stores/MainStore';
import { Incorporator } from './utils/Incorporator';
import { Rx } from './utils/Rx';

function renderScrollForm({ scrollValue }: { scrollValue: string }): JSX.Element {
  return (
    <div
      style={{
        position: 'fixed',
        top: '8px',
        right: '16px',
      }}
    >
      <Text variant="medium">スクロール値 : {scrollValue}</Text>
      <Incorporator
        type={TextField}
        props={{
          sel: 'event-input-offsetY',
          type: 'number',
          placeholder: 'input offset-y value...',
        }}
      />
    </div>
  );
}

function render({
  store,
  thumbsDownDOM,
  thumbsUpDOM,
}: {
  store: Store;
  thumbsUpDOM: React.ReactElement;
  thumbsDownDOM: React.ReactElement;
}): React.ReactElement {
  const { name, vote } = store;
  return (
    <div
      style={{
        height: 3000,
      }}
    >
      <Text variant="xLarge">{name ? `Hello, ${name}!!!!` : `What's your name?`}</Text>
      <Incorporator
        type={TextField}
        props={{ sel: 'event-input-name', placeholder: 'naoki yamada', value: name, label: 'Your name' }}
      />
      <hr />
      {renderScrollForm(store)}
      {thumbsUpDOM}
      {thumbsDownDOM}
      <p>Vote: {vote}</p>
    </div>
  );
}

function main({ DOM, Scroll }: SoAll): SiAll {
  const eventInputName$ = Rx.O(DOM.select('event-input-name').events('change'));
  const eventInputOffset$ = Rx.O(DOM.select('event-input-offsetY').events('change'));

  const thumbsUpComponent = VoteComponent({
    DOM,
    props: {
      label: '👍',
      value: 1,
    },
  }) as SiVote;
  const thumbsDownComponent = VoteComponent({
    DOM,
    props: {
      label: '👎',
      value: -1,
    },
  }) as SiVote;

  const store$: Observable<Store> = merge(
    eventInputName$.pipe(map((e: Event) => makeUpdateNameAction((e.target as HTMLInputElement).value))),
    Scroll.pipe(
      startWith('0px'),
      map(makeUpdateScrollValue),
    ),
    merge(thumbsUpComponent.value$, thumbsDownComponent.value$).pipe(map(value => makeUpdateVoteAction(value))),
  ).pipe(
    scan((acc: Store, fn: StoreAction) => fn(acc), initialStore),
    share(),
    startWith(initialStore),
  );

  const dom$ = combineLatest(
    thumbsUpComponent.DOM,
    thumbsDownComponent.DOM,
    store$,
    (thumbsUpDOM, thumbsDownDOM, store) =>
      render({
        thumbsUpDOM,
        thumbsDownDOM,
        store,
      }),
  );

  return {
    DOM: dom$,
    Scroll: eventInputOffset$.pipe(
      map((e: Event) => ({
        offsetTop: Number((e.target as HTMLInputElement).value),
      })),
    ),
  };
}

run(main, {
  DOM: makeDOMDriver(document.getElementById('app')),
  Scroll: makeScrollDriver(),
});
