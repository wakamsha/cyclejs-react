import { incorporate } from '@cycle/react/lib/cjs/incorporate';
import * as React from 'react';

type Props = {
  type: string | ((props?: any) => JSX.Element);
  props: any;
  children?: React.ReactNode;
};
export function Incorporator<P = any>(props: Props): React.ReactElement<P> {
  return React.createElement<any>(incorporate(props.type), props.props, props.children);
}
