interface GlobalState {
  [key: string]: {
    callbacks: Function[];
    value: any;
  };
}

interface GlobalStateHandle {
  deregister(): void;
  emit(value: any): void;
}

const globalState: GlobalState = {};

export const createGlobalState = (key: string, thisCallback: Function, initialValue: any): GlobalStateHandle => {
  if (!globalState[key]) {
    globalState[key] = { callbacks: [], value: initialValue };
  }
  globalState[key].callbacks.push(thisCallback);
  return {
    deregister() {
      const arr = globalState[key].callbacks;
      const index = arr.indexOf(thisCallback);
      if (index > -1) {
        arr.splice(index, 1);
      }
    },
    emit(value: any) {
      if (globalState[key].value !== value) {
        globalState[key].value = value;
        globalState[key].callbacks.forEach((callback: Function) => {
          if (thisCallback !== callback) {
            callback(value);
          }
        });
      }
    },
  };
};
