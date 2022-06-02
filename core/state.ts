import { atom, selector } from 'recoil';

export interface CoreState {
  notifications: any[];
  ui: {
    sidebarOpen: boolean
  }
}

export const atomCoreState = atom<CoreState>({
  key: 'atomCoreState',
  default: {
    notifications: [],
    ui: {
      sidebarOpen: true
    }
  }
});

export const selectorNotifications = selector<Notification[]>({
  key: 'selectorNotifications',
  get: ({ get }) => {
      const { notifications } = get(atomCoreState);
      return notifications;
  }
});

export const selectorUI = selector<CoreState['ui']>({
  key: 'selectorNotifications',
  get: ({ get }) => {
      const { ui } = get(atomCoreState);
      return ui;
  }
});