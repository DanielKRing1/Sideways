export const BoxShadowStylesStr = `
    elevation: 24;

    shadowOffset: 0px 12px;
    shadowColor: black;
    shadowOpacity: 0.58;
    shadowRadius: 16px;
`;

export const getBoxShadowStyles = (shadowColor: string = '#000') => ({
  shadowColor,
  shadowOffset: {
    width: 0,
    height: 12,
  },
  shadowOpacity: 0.58,
  shadowRadius: 16.0,

  elevation: 24,
});
