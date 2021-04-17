import React, { Component } from 'react';
import styled from 'styled-components';
import Switch from 'react-toggle-switch';
import { shell } from 'electron';
import Rodal from 'rodal';
import os from 'os';

import SegmentedControl from '../../components/SegmentedControl';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import SyncModal from '../../components/SyncModal';
import ImportExportModal from '../../components/ImportExportModal';
import { colors, fontSizes } from '../../lib/constants';
import appPackage from '../../../package.json';

import * as T from '../../lib/types';

interface SettingsProps extends T.WrappedComponentProps {}
interface SettingsState {
  isSubmitting: boolean;
  isSettingsModalOpen: boolean;
  isSyncModalOpen: boolean;
  isImportExportModalOpen: boolean;
  syncToken: string;
  currency: string;
}

const { buildHash: appBuild, version: appVersion } = appPackage;

const SettingsButton = styled(IconButton)`
  top: 8px;
  right: -8px;
  position: absolute;
`;

// TODO: Get these colors from the withLayout, according to the light/dark mode
const Container = styled.section`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: stretch;
  flex-direction: column;
  background-color: ${colors().background};
`;

const SyncContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 38px;

  span {
    margin-top: 0;
  }
`;

const Label = styled.span`
  color: ${colors().inputLabel};
  font-size: ${fontSizes.inputLabel}px;
  font-weight: bold;
  text-align: left;
  margin-top: 38px;
`;

const StyledSegmentedControl = styled(SegmentedControl)`
  margin: 15px auto 10px;
  width: 96%;
`;

const Note = styled.span`
  color: ${colors().secondaryText};
  font-size: ${fontSizes.mediumText}px;
  font-weight: normal;
  text-align: left;
  margin-top: 12px;
`;

const BottomContainer = styled.section`
  display: flex;
  flex: 0.5;
  flex-direction: column;
`;

const Version = styled.p`
  color: ${colors().secondaryText};
  font-size: ${fontSizes.smallText}px;
  font-weight: normal;
  text-align: center;
  margin-top: 30px;
`;

const ImportExportButton = styled(Button)`
  margin: 5px auto 10px;
  align-self: center;
`;

const HelpButton = styled(Button)`
  margin: 0 auto 10px;
  align-self: center;
`;

const Code = styled.code`
  display: inline-block;
  margin: 0 1px 2px;
  padding: 4px;
  border-radius: 4px;
  white-space: nowrap;
  letter-spacing: 0.2px;
  background-color: ${colors().secondaryBackground};
  font-family: inherit;
  line-height: 1em;
`;

const currencyLabels = ['$', '€', '£'];
const currencyValues = ['USD', 'EUR', 'GBP'];

class Settings extends Component<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);

    this.state = {
      isSubmitting: false,
      isSettingsModalOpen: false,
      isSyncModalOpen: false,
      isImportExportModalOpen: false,
      syncToken: '',
      currency: '',
    };
  }

  async componentDidMount() {
    const { getSetting } = this.props;
    const currency = await getSetting('currency');
    const syncToken = await getSetting('syncToken');

    this.setState({ syncToken, currency });
  }

  saveSetting = async (settingName: T.SettingOption) => {
    const { saveSetting, showNotification } = this.props;
    const { isSubmitting, syncToken, currency } = this.state;

    if (isSubmitting) {
      // Ignore sequential taps
      return;
    }

    this.setState({ isSubmitting: true });

    const parsedSetting: T.Setting = {
      name: settingName,
      value: settingName === 'syncToken' ? syncToken : currency,
    };

    const success = await saveSetting(parsedSetting);

    this.setState({ isSubmitting: false });

    if (success) {
      showNotification('Settings saved successfully.');
    }
  };

  exportData = async () => {
    const { exportAllData } = this.props;

    return exportAllData();
  };

  importData = async (
    replaceData: boolean,
    budgets: T.Budget[],
    expenses: T.Expense[],
  ) => {
    const { importData } = this.props;

    return importData(replaceData, budgets, expenses);
  };

  deleteData = async () => {
    const { deleteAllData } = this.props;

    return deleteAllData();
  };

  render() {
    const { loadData, lastSyncDate, showAlert, showNotification } = this.props;
    const {
      isSettingsModalOpen,
      isSyncModalOpen,
      isImportExportModalOpen,
      syncToken,
      currency,
    } = this.state;

    const selectedCurrencyIndex = currencyValues.findIndex(
      (_currency) => currency === _currency,
    );

    return (
      <>
        <SettingsButton
          icon="settings"
          size={26}
          color={colors().secondaryButtonBackground}
          onClick={() => this.setState({ isSettingsModalOpen: true })}
        />
        <Rodal
          visible={isSettingsModalOpen}
          onClose={() => this.setState({ isSettingsModalOpen: false })}
          animation="slideDown"
        >
          <Container>
            <SyncContainer
              onClick={() => this.setState({ isSyncModalOpen: true })}
            >
              <Label>Sync</Label>
              <Switch
                on={Boolean(syncToken) && Boolean(lastSyncDate)}
                onClick={() => {}}
              />
            </SyncContainer>
            <Note>Sync expenses and budgets across devices.</Note>
            <Note>
              Press <Code>{os.platform() === 'darwin' ? '⌘' : 'CTRL+'}R</Code>{' '}
              to forcefully refresh data.
            </Note>

            <Label>Currency</Label>
            <StyledSegmentedControl
              values={currencyLabels}
              selectedIndex={
                selectedCurrencyIndex === -1 ? 0 : selectedCurrencyIndex
              }
              onChange={(selectedSegmentIndex: number) => {
                this.setState(
                  {
                    currency: currencyValues[selectedSegmentIndex],
                  },
                  () => {
                    this.saveSetting('currency');
                  },
                );
              }}
            />
            <BottomContainer>
              <Version>
                v{appVersion}-{appBuild}
              </Version>
              <ImportExportButton
                onClick={() => this.setState({ isImportExportModalOpen: true })}
                text="Import or Export Data"
                type="secondary"
              />
              <HelpButton
                onClick={() => shell.openExternal('mailto:help@budgetzen.net')}
                text="Get Help"
                type="primary"
              />
            </BottomContainer>
            <SyncModal
              key={syncToken}
              isOpen={isSyncModalOpen}
              onClose={() => this.setState({ isSyncModalOpen: false })}
              onConfirm={async (newSyncToken) => {
                this.setState(
                  {
                    syncToken: newSyncToken,
                  },
                  () => {
                    this.saveSetting('syncToken');
                  },
                );
              }}
              onSyncRequest={async () => {
                await loadData({ forceReload: true });
                this.setState({ isSyncModalOpen: false });
              }}
              onDeleteData={this.deleteData}
              syncToken={syncToken}
              lastSyncDate={lastSyncDate}
            />
            <ImportExportModal
              isOpen={isImportExportModalOpen}
              onClose={() => this.setState({ isImportExportModalOpen: false })}
              onExportData={this.exportData}
              onImportData={this.importData}
              showAlert={showAlert}
              showNotification={showNotification}
            />
          </Container>
        </Rodal>
      </>
    );
  }
}

export default Settings;
