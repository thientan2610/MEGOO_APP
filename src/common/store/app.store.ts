import {action, makeAutoObservable, observable} from 'mobx';

class AppStore {
  @observable isLoggedIn = false;
  @observable isExtendedPkg = false;
  @observable renewGroupId = '';
  @observable renewPkgId = '';
  @observable renewPkg = {
    package: '',
    noOfMember: 0,
    duration: 0,
  };

  @observable searchActive = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action setIsLoggedIn(state: boolean) {
    this.isLoggedIn = state;
  }

  @action setIsExtendedPkg(state: boolean) {
    this.isExtendedPkg = state;
  }

  @action setRenewGroupId(groupId: string) {
    this.renewGroupId = groupId;
  }

  @action setRenewPkgId(pkgId: string) {
    this.renewPkgId = pkgId;
  }

  @action setRenewPkg(pkg: any) {
    this.renewPkg.package = pkg['package'];
    this.renewPkg.noOfMember = pkg['noOfMember'];
    this.renewPkg.duration = pkg['duration'];
  }

  @action setSearchActive(state: boolean) {
    this.searchActive = state;
  }

  @action getIsExtendedPkg() {
    return this.isExtendedPkg;
  }
}

const appStore = new AppStore();
export default appStore;
