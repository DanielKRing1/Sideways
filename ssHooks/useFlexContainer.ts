import { useMemo } from "react";
import { FlexRow, FlexCol } from "../ssComponents/Flex";

export const useFlexContainer = (flexDirection: 'row' | 'column') => useMemo(() => flexDirection === 'row' ? FlexRow : FlexCol, [flexDirection]);
