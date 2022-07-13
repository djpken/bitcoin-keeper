import React, { useContext } from 'react';
import { FlatList, Box, Text } from 'native-base';

import { RFValue } from 'react-native-responsive-fontsize';
import DotView from '../DotView';
import { RealmWrapperContext } from 'src/storage/realm/RealmProvider';
import { RealmSchema } from 'src/storage/realm/enum';
import { getJSONFromRealmObject } from 'src/storage/realm/utils';

const VersionHistoryList = () => {
  const { useQuery } = useContext(RealmWrapperContext);
  const VersionHistoryData = useQuery(RealmSchema.VersionHistory).map(getJSONFromRealmObject);

  return (
    <FlatList
      style={{ overflow: 'visible' }}
      data={VersionHistoryData.reverse()}
      renderItem={({ item }) => (
        <Box borderLeftColor={'#E3BE96'} borderLeftWidth={1} w={'100%'} position="relative">
          <Box
            zIndex={99}
            position={'absolute'}
            left={-8}
            bg={'light.ReceiveBackground'}
            p={1}
            borderRadius={15}
          >
            <DotView height={2} width={2} color={'#E3BE96'} />
          </Box>
          <Text
            color={'light.GreyText'}
            fontSize={RFValue(10)}
            fontWeight={'300'}
            ml={5}
            opacity={0.7}
          >
            {item.date}
          </Text>
          <Box bg={'light.lightYellow'} p={5} borderRadius={10} my={2} ml={5}>
            <Text color={'light.headerText'} fontSize={RFValue(14)} fontFamily={'heading'}>
              {item.title}
            </Text>
            <Text color={'light.GreyText'} fontSize={RFValue(12)} fontFamily={'body'}>
              {item.version}
            </Text>
            <Text color={'light.GreyText'} fontSize={RFValue(12)} fontFamily={'body'}>
              {item.releaseNote}
            </Text>
          </Box>
        </Box>
      )}
      keyExtractor={(item) => item.version}
    />
  );
};
export default VersionHistoryList;
