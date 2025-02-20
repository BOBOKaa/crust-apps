// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useOwnStashInfos } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ZERO, isFunction } from '@polkadot/util';

interface Props {
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
  onSuccess: () => void;
}

function CreateGroup ({ className = '', onClose, onSuccess, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const ownStashes = useOwnStashInfos();
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount] = useState<BN | undefined>(BN_ZERO);
  const [hasAvailable] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setMaxTransfer] = useState<BN | null>(null);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances.all, [senderId]);

  const stashes = useMemo(
    () => (ownStashes || []).map(({ stashId }) => stashId),
    [ownStashes]
  );

  useEffect((): void => {
    if (balances && balances.accountId.eq(senderId) && senderId && isFunction(api.rpc.payment?.queryInfo)) {
      setTimeout((): void => {
        try {
          api.tx.swork
            .createGroup()
            .paymentInfo(senderId)
            .then(({ partialFee }): void => {
              const maxTransfer = balances.availableBalance.sub(partialFee);

              setMaxTransfer(
                maxTransfer.gt(api.consts.balances.existentialDeposit)
                  ? maxTransfer
                  : null
              );
            })
            .catch(console.error);
        } catch (error) {
          console.error((error as Error).message);
        }
      }, 0);
    } else {
      setMaxTransfer(null);
    }
  }, [api, balances, senderId]);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Group create')}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Content>
            <Modal.Columns hint={t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}>
              <InputAddress
                defaultValue={propSenderId}
                filter={stashes}
                help={t<string>('The account you will register')}
                isDisabled={!!propSenderId}
                label={t<string>('send from account')}
                labelExtra={
                  <Available
                    label={t<string>('transferrable')}
                    params={senderId}
                  />
                }
                onChange={setSenderId}
                type='account'
              />
            </Modal.Columns>

          </Modal.Content>
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={senderId}
          icon='paper-plane'
          isDisabled={!hasAvailable || !amount}
          label={t<string>('Create')}
          onStart={onClose}
          onSuccess={onSuccess}
          tx={api.tx.swork.createGroup}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(CreateGroup)`
  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }

  .typeToggle {
    text-align: right;
  }

  .typeToggle+.typeToggle {
    margin-top: 0.375rem;
  }
`);
