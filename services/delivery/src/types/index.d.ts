export type Data<T> = {
  request: T;
};

export type Stream<T> = {
  write: (data: any) => void;
  end: () => void;
  request: T;
};
