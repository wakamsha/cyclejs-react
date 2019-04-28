import { ReactSource } from '@cycle/react';
import { ReactElement } from 'react';
import { Observable } from 'rxjs';
import { ScrollSink } from './ScrollDriver';

export type SoDOM = { DOM: ReactSource };
export type SoScroll = { Scroll: Observable<string> };

export type SiDOM = { DOM: Observable<ReactElement<any>> };
export type SiScroll = { Scroll: Observable<ScrollSink> };

export type SoAll = SoDOM & SoScroll;
export type SiAll = SiDOM & SiScroll;
