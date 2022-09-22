import { useMemo } from "react";
import { FlexRow, FlexCol } from "../components/Flex";

export const useFlexContainer = (flexDirection: 'row' | 'column') => useMemo(() => flexDirection === 'row' ? FlexRow : FlexCol, [flexDirection]);
