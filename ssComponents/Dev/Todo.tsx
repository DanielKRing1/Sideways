import React, {FC} from 'react';
import styled from 'styled-components/native';
import FlexRow from '../Flex/FlexRow';
import MyText from '../ReactNative/MyText';

type TodoProps = {
  children?: React.ReactNode;

  name: string;
  onPress?: () => void;
} & StyleProps;
type StyleProps = {
  width?: string;
  height?: string;
  color?: string;
  fontSize?: string;
};
const Todo: FC<TodoProps> = props => {
  const {
    children,
    name,
    onPress = () => {},
    width = '100%',
    height = '40px',
    color = 'black',
    fontSize = '12px',
  } = props;

  return (
    <StyledTouchableOpacity width={width} height={height}>
      <FlexRow>
        <StyledText fontSize={'18px'} color={color}>
          Todo:
        </StyledText>

        <StyledText fontSize={fontSize} color={color}>
          {name}
        </StyledText>
      </FlexRow>

      {children}
    </StyledTouchableOpacity>
  );
};

export default Todo;

const StyledText = styled(MyText)<StyleProps>`
  color: ${({color}) => color};

  font-size: ${({fontSize}) => fontSize};
`;

const StyledTouchableOpacity = styled.TouchableOpacity<StyleProps>`
  width: ${({width}) => width};
  height: ${({height}) => height};
`;
