// Copyright 2019-2021 Crust Network authors & contributors
// License: Apache-2.0

import type { TFunction } from 'i18next';
import type { AuthIpfsEndpoint } from './types';

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../ui/logos, specifically in namedLogos
//   text: the IPFS endpoint name
//   value: the IPFS endpoint domain
//   location: IPFS gateway location
export function createAuthIpfsEndpoints (t: TFunction): AuthIpfsEndpoint[] {
  return [
    // for Beta
    // {
    //   location: t('BETA'),
    //   text: t('Beta'),
    //   value: 'https://beta.ipfs-auth.decoo.io'
    // },
    // for prod
    {
      location: t('Singapore'),
      text: t('DCF'),
      value: 'https://crustipfs.xyz'
    },
    // {
    //   location: t('Seattle'),
    //   text: t('⚡ Thunder Gateway'),
    //   value: 'https://crustwebsites.net'
    // },
    {
      location: t('Berlin'),
      text: t('Crust Network'),
      value: 'https://ipfs-gw.decloud.foundation'
    },
    {
      location: t('Shanghai'),
      text: t('️⚡ Thunder Gateway'),
      value: 'https://gw.crustapps.net'
    },
    {
      location: t('Beijing'),
      text: t('️Deklod'),
      value: 'https://ipfs-gw.dkskcloud.com'
    }
  ];
}
