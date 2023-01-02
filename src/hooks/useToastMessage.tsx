import HexaToastMessages from 'src/components/ToastMessages';
import React from 'react';
import { useToast } from 'native-base';

const useToastMessage = () => {
  const Toast = useToast();

  function showToast(title, image?, duration = 1000, error = false) {
    Toast.show({
      render: () => <HexaToastMessages title={title} Image={image} error={error} />,
      duration,
    });
  }

  return { showToast };
};

export default useToastMessage;
