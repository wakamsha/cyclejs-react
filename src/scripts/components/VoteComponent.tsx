import isolate from '@cycle/isolate';
import * as React from 'react';
import { Observable, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { SiDOM, SoDOM } from '../drivers/interface';
import { Incorporator } from '../utils/Incorporator';
import { Rx } from '../utils/Rx';

type Props = {
  label: string;
  value: number;
};

type So = {
  props: Props;
} & SoDOM;

export type Si = {
  value$: Observable<number>;
} & SiDOM;

function render({ props }: { props: Props }): React.ReactElement {
  return (
    <>
      <Incorporator
        type="button"
        props={{
          sel: 'sel-click',
          style: {
            fontSize: 32,
            cursor: 'pointer',
          },
        }}
      >
        {props.label}
      </Incorporator>
    </>
  );
}

function Component({ DOM, props }: So): Si {
  const eventInput$ = Rx.O(DOM.select('sel-click').events('click'));

  const dom$ = of(render({ props }));

  return {
    value$: eventInput$.pipe(mapTo(props.value)),
    DOM: dom$,
  };
}

export function VoteComponent(so: So): any {
  return isolate<So, Si>(Component)(so);
}
