import React from 'react';
import Text from 'src/components/KeeperText';
import { Box, useColorMode } from 'native-base';
import Switch from '../../components/Switch/Switch';

function CountryCard(props) {
  const { colorMode } = useColorMode();

  return (
    <Box
      backgroundColor={`${colorMode}.white`}
      flexDirection="row"
      justifyContent="space-evenly"
      mx={7}
      padding={3}
      borderRadius={10}
      {...props}
    >
      <Box flex={0.8}>
        <Text color="light.greenText2" letterSpacing={1.12} fontSize={16}>
          {props.title}
        </Text>
        <Text color="light.GreyText" letterSpacing={0.6} fontSize={12}>
          {props.description}
        </Text>
      </Box>
      <Box flex={0.2} justifyContent="center" alignItems="center">
        <Switch onValueChange={(value) => props.onSwitchToggle(value)} value={props.value} />
      </Box>
    </Box>
  );
}

export default CountryCard;
