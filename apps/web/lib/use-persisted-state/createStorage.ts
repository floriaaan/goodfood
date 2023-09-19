type StorageProvider = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

type Storage = {
  get<T>(key: string, defaultValue: T | (() => T)): T;
  set(key: string, value: any): void;
};

export const createStorage = (provider: StorageProvider): Storage => ({
  get<T>(key: string, defaultValue: T | (() => T)): T {
    const json = provider.getItem(key);
    return json === null || typeof json === "undefined"
      ? typeof defaultValue === "function"
        ? (defaultValue as () => T)()
        : defaultValue
      : JSON.parse(json);
  },
  set(key: string, value: any): void {
    provider.setItem(key, JSON.stringify(value));
  },
});
