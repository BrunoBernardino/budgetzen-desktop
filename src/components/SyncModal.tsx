import React, { Component } from 'react';
import styled from 'styled-components';
import Rodal from 'rodal';
import { shell, remote } from 'electron';

import Button from './Button';
import { colors, fontSizes } from '../lib/constants';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newSyncToken: string) => Promise<void>;
  onSyncRequest: () => Promise<void>;
  onDeleteData: () => Promise<boolean>;
  syncToken: string;
  lastSyncDate: string;
}
interface SyncModalState {
  isSubmitting: boolean;
  syncToken: string;
}

// TODO: Dark mode y'all
const Container = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${colors().background};
  padding: 0 16px;
`;

const Label = styled.label`
  color: ${colors().inputLabel};
  font-size: ${fontSizes.inputLabel}px;
  font-weight: bold;
  text-align: left;
  margin-top: 38px;
`;

const Input = styled.input`
  font-family: inherit;
  color: ${colors().inputField};
  font-size: ${fontSizes.inputField}px;
  font-weight: normal;
  text-align: left;
  margin-top: 8px;
  background-color: ${colors().background};
  padding: 5px 8px;
  border: 1px solid ${colors().secondaryBackground};
  border-radius: 5px;
  outline: none;

  &::-webkit-input-placeholder {
    color: ${colors().inputPlaceholder};
  }

  &:hover,
  &:focus,
  &:active {
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
  }
`;

type NoteProps = {
  type?: 'error';
};
const Note = styled.span<NoteProps>`
  color: ${({ type }) => (type === 'error' ? '#930' : colors().inputLabel)};
  font-size: ${fontSizes.mediumText}px;
  font-weight: normal;
  text-align: left;
  margin-top: 30px;
`;

const SyncNote = styled.span`
  color: ${colors().secondaryText};
  font-size: ${fontSizes.smallText}px;
  font-weight: normal;
  text-align: left;
  margin-top: 10px;
  padding: 0 10px;
`;

const MainButton = styled(Button)`
  margin-top: 30px;
  align-self: center;
`;

const ForceSyncButton = styled(Button)`
  margin-top: 20px;
  align-self: center;
`;

class SyncModal extends Component<SyncModalProps, SyncModalState> {
  constructor(props: SyncModalProps) {
    super(props);

    this.state = {
      isSubmitting: false,
      syncToken: props.syncToken,
    };
  }

  componentDidMount() {
    const { syncToken } = this.props;

    this.setState({
      syncToken,
    });
  }

  onConfirm = async () => {
    const { onConfirm, onClose } = this.props;
    const { isSubmitting, syncToken } = this.state;

    if (isSubmitting) {
      // Ignore sequential clicks
      return;
    }

    this.setState({ isSubmitting: true });

    await onConfirm(syncToken);

    this.setState({ isSubmitting: false });
    onClose();
  };

  onGetToken = async () => {
    shell.openExternal('https://budgets.calm.sh/get-sync-token');
  };

  onForceSync = async () => {
    const { onSyncRequest } = this.props;
    const { isSubmitting } = this.state;

    if (isSubmitting) {
      // Ignore sequential taps
      return;
    }

    this.setState({ isSubmitting: true });

    await onSyncRequest();

    this.setState({ isSubmitting: false });
  };

  requestDataDelete = async () => {
    const { onClose, onDeleteData } = this.props;

    const cancelButtonIndex = 0;
    const confirmButtonIndex = 1;
    const confirmationResult = await remote.dialog.showMessageBox({
      type: 'warning',
      title: 'Are you sure?',
      message:
        'Are you sure you want to delete all data?\n\nThis action is irreversible.',
      buttons: ['Nope, cancel.', 'Yes!'],
      defaultId: confirmButtonIndex,
      cancelId: cancelButtonIndex,
    });

    if (
      !confirmationResult ||
      confirmationResult.response !== confirmButtonIndex
    ) {
      return;
    }

    this.setState({ isSubmitting: true });
    const success = await onDeleteData();
    this.setState({ isSubmitting: false });

    if (success) {
      onClose();
    }
  };

  onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.onConfirm();
    }
  };

  render() {
    const {
      isOpen,
      onClose,
      lastSyncDate,
      syncToken: currentSyncToken,
    } = this.props;
    const { syncToken } = this.state;

    const hasSyncEnabled = Boolean(currentSyncToken) && Boolean(lastSyncDate);

    return (
      <Rodal visible={isOpen} onClose={onClose} animation="slideDown">
        <Container>
          <Label>Sync Token</Label>
          <Input
            placeholder="Paste here"
            onChange={(event) =>
              this.setState({ syncToken: event.target.value })
            }
            onBlur={() => this.onConfirm()}
            value={syncToken}
            autoComplete="off"
            type="password"
            onKeyDown={this.onKeyDown}
          />

          {!hasSyncEnabled && Boolean(currentSyncToken) && (
            <>
              <Note type="error">
                It seems your sync token above isn't working, for some reason.
                {'\n'}
                Please confirm you have no extra spaces and there's no trailing
                slash.
              </Note>
            </>
          )}

          {hasSyncEnabled && (
            <>
              <Note>Congrats on setting up a Sync Token!</Note>

              <Note>
                The button below will open a website where you can reach me to
                get help, if you're having any issues.
              </Note>
            </>
          )}

          {!hasSyncEnabled && (
            <>
              <Note>
                You can pay me a small amount yearly to get a Sync Token, or you
                can setup one yourself.
              </Note>

              <Note>
                The button below will open a website where you can learn more
                about both options.
              </Note>

              <Note>
                If you choose to pay for the subscription, you'll get an email
                with the Sync Token that you can paste here.
              </Note>
            </>
          )}

          <MainButton
            onClick={() => this.onGetToken()}
            text={hasSyncEnabled ? 'Get Help' : 'Get a Sync Token'}
            type="primary"
          />

          {hasSyncEnabled && (
            <>
              <ForceSyncButton
                type="secondary"
                text="Force Sync Now"
                onClick={() => this.onForceSync()}
              />

              <SyncNote>Last sync: {lastSyncDate}</SyncNote>
            </>
          )}

          <MainButton
            onClick={() => this.requestDataDelete()}
            text="Delete All Data"
            type="delete"
          />
        </Container>
      </Rodal>
    );
  }
}

export default SyncModal;
