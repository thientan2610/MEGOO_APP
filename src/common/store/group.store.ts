import {action, makeAutoObservable, observable} from 'mobx';

class GroupStore {
  @observable id = '';
  @observable channelUrl = '';

  constructor() {
    makeAutoObservable(this);
  }

  @action setGroup(groupId: string, channelUrl: string) {
    this.id = groupId;
    this.channelUrl = channelUrl;
  }

  @action setGroupId(groupId: string) {
    this.id = groupId;
  }

  @action setGroupChannelUrl(channelUrl: string) {
    this.channelUrl = channelUrl;
  }

  @action resetGroup() {
    this.id = '';
    this.channelUrl = '';
  }

  @observable
  toUpdateGroupDropdown = false;

  @action
  setToUpdateGroupDropdown(toUpdateGroupDropdown: boolean) {
    this.toUpdateGroupDropdown = toUpdateGroupDropdown;
  }

  @observable
  barcode = '';

  @action
  setBarcode(barcode: string) {
    this.barcode = barcode;
  }
}

const groupStore = new GroupStore();
export default groupStore;
