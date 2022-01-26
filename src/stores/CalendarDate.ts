import { observable, action, makeObservable, computed } from 'mobx';
import dayjs from 'dayjs';

import { RootStore } from '.';

export class DateStore {
  rootStore: RootStore;

  @observable _date = dayjs().hour(0).minute(0).second(0).millisecond(0);

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable(this);
  }

  @computed
  get date() {
    return this._date;
  }

  @action
  decreaseDateMonth() {
    this._date = this._date.subtract(1, 'month');
  }

  @action
  increaseDateMonth() {
    this._date = this._date.add(1, 'month');
  }
}
