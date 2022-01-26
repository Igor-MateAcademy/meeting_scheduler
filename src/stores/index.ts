import { configure, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import remotedev from 'mobx-remotedev';

import { DateStore } from './CalendarDate';

configure({ enforceActions: 'observed' });
@remotedev({ global: true })
export class RootStore {
  @observable dateStore: DateStore;

  constructor() {
    this.dateStore = new DateStore(this);

    makeObservable(this);
  }
}

const store = new RootStore();

export const StoreContext = createContext<RootStore>(store);

export const useStore = (): RootStore => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('You have forgot to use StoreProvider, shame on you.');
  }
  return store;
};

export default store;
