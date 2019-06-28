class StorageController {

  storage = window.localStorage;
  key = 'diggs-todo-state';

  loadState() {

    const state = this.storage.getItem(this.key);

    if (state == null) {
      return undefined;
    }

    return JSON.parse(state);
  }

  saveState(state: any) {

    try {
      this.storage.setItem(this.key, JSON.stringify(state));
    }
    catch (error) {
      console.log("Error while saving state:", error);
    }
  }
}

export const Storage = new StorageController();