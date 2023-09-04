import {FC} from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tooltip from 'react-native-walkthrough-tooltip';
import {Colors} from '../../../constants/color.const';

interface ITooltipProps {
  type: 'icon' | 'image';
  content: string;
  iconName?: string;
  imageUrl?: string;
  isTooltipVisible: boolean;
  setIsTooltipVisible: (state: boolean) => void; //set selected image from parent component
}

const ToolTip: FC<ITooltipProps> = ({
  type,
  content,
  iconName,
  imageUrl,
  isTooltipVisible,
  setIsTooltipVisible,
}) => {
  return (
    <Tooltip
      displayInsets={{top: 10, left: 10, right: 10, bottom: 10}}
      placement="bottom"
      isVisible={isTooltipVisible}
      onClose={() => setIsTooltipVisible(false)}
      contentStyle={{width: 200}}
      content={
        <Text
          style={{width: '100%', color: Colors.text.red, textAlign: 'center'}}>
          {content}
        </Text>
      }>
      <TouchableOpacity onPress={() => setIsTooltipVisible(!isTooltipVisible)}>
        {type === 'icon' ? (
          <Ionicons name={`${iconName}`} size={22} color={'black'} />
        ) : (
          <Image
            source={{uri: `${imageUrl}`}}
            style={{width: 20, height: 20, borderRadius: 10}}
          />
        )}
      </TouchableOpacity>
    </Tooltip>
  );
};

export default ToolTip;
