import isolate from '@cycle/isolate';
import { DefaultButton } from 'office-ui-fabric-react';
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
        type={DefaultButton}
        props={{
          sel: 'sel-click',
          style: {
            fontSize: 32,
            cursor: 'pointer',
          },
          text: props.label,
        }}
      />
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

// OuterSi 型の定義に問題があるっぽいため、
// 戻り値を any型にしないとコンパイルエラーとなる。
export function VoteComponent(so: So): any {
  return isolate<So, Si>(Component)(so);
}
