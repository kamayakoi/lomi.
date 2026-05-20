/** MTN MoMo target environment + phone prefix by ISO country code (checkout parity). */
export function getMtnCountryConfig(countryCode: string): {
  targetEnvironment: string;
  phonePrefix: string;
} {
  switch ((countryCode || 'CI').toUpperCase()) {
    case 'CM':
      return { targetEnvironment: 'mtncameroon', phonePrefix: '+237' };
    case 'GH':
      return { targetEnvironment: 'mtnghana', phonePrefix: '+233' };
    case 'UG':
      return { targetEnvironment: 'mtnuganda', phonePrefix: '+256' };
    case 'ZM':
      return { targetEnvironment: 'mtnzambia', phonePrefix: '+260' };
    case 'BJ':
      return { targetEnvironment: 'mtnbenin', phonePrefix: '+229' };
    case 'CG':
      return { targetEnvironment: 'mtncongo', phonePrefix: '+242' };
    case 'SZ':
      return { targetEnvironment: 'mtnswaziland', phonePrefix: '+268' };
    case 'GN':
      return { targetEnvironment: 'mtnguineaconakry', phonePrefix: '+224' };
    case 'ZA':
      return { targetEnvironment: 'mtnsouthafrica', phonePrefix: '+27' };
    case 'LR':
      return { targetEnvironment: 'mtnliberia', phonePrefix: '+231' };
    case 'NG':
      return { targetEnvironment: 'mtnnigeria', phonePrefix: '+234' };
    case 'CI':
    default:
      return { targetEnvironment: 'mtnivorycoast', phonePrefix: '+225' };
  }
}
