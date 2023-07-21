import React, { ReactNode, ComponentType } from 'react';
import { TouchableWithoutFeedback, Keyboard, View, ViewProps } from 'react-native';

const DismissKeyboardHOC = <P extends object>(Component: ComponentType<P>) => {
  type WrapperProps = Omit<P, keyof ViewProps> & { children?: ReactNode };

  return (props: WrapperProps) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Component {...props as P} />
    </TouchableWithoutFeedback>
  );
};

export const DismissKeyboardView = DismissKeyboardHOC<ViewProps>(View);
