import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PrimaryButton from '../PrimaryButton';

test('PrimaryButton calls onPress', () => {
  const onPress = jest.fn();
  const { getByText } = render(<PrimaryButton title="Click me" onPress={onPress} />);
  fireEvent.press(getByText('Click me'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
