import {action, makeAutoObservable, observable} from 'mobx';

class SearchStore {
  @observable
  public searchText: string = '';

  @action
  public setSearchText = (search: string) => {
    this.searchText = search;
  };

  @observable
  public isPerformingSearch: boolean = false;

  @action
  public setIsPerformingSearch = (isPerformingSearch: boolean) => {
    this.isPerformingSearch = isPerformingSearch;
  };

  constructor() {
    makeAutoObservable(this);
  }
}

const searchStore = new SearchStore();

export default searchStore;
