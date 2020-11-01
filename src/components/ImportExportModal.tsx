import fs from 'fs';
import path from 'path';
import React, { Component } from 'react';
import styled from 'styled-components';
import Rodal from 'rodal';
import { shell, remote } from 'electron';

import Button from './Button';
import { colors, fontSizes } from '../lib/constants';

import * as T from '../lib/types';

type ImportedFileData = {
  budgets?: T.Budget[];
  expenses?: T.Expense[];
};

type ExportFileData = {
  budgets: T.Budget[];
  expenses: T.Expense[];
};

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportData: (
    replaceData: boolean,
    budgets: T.Budget[],
    expenses: T.Expense[],
  ) => Promise<boolean>;
  onExportData: () => Promise<ExportFileData>;
  showAlert: (title: string, message: string) => void;
  showNotification: (message: string) => void;
}
interface ImportExportModalState {
  isSubmitting: boolean;
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

const Note = styled.span`
  color: ${colors().inputLabel};
  font-size: ${fontSizes.mediumText}px;
  font-weight: normal;
  text-align: left;
  margin-top: 30px;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  align-self: center;
`;

class ImportExportModal extends Component<
  ImportExportModalProps,
  ImportExportModalState
> {
  constructor(props: ImportExportModalProps) {
    super(props);

    this.state = {
      isSubmitting: false,
    };
  }

  onLearnMore = async () => {
    shell.openExternal('https://budgetzen.net/import-export-file-format');
  };

  onRequestImport = async () => {
    const { onImportData, onClose, showAlert } = this.props;
    const { isSubmitting } = this.state;

    if (isSubmitting) {
      // Ignore sequential taps
      return;
    }

    const importFileDialogResult = await remote.dialog.showOpenDialog({
      title: 'Choose JSON File',
      filters: [{ name: 'JSON', extensions: ['json'] }],
      properties: ['openFile'],
    });

    if (
      !importFileDialogResult ||
      importFileDialogResult.canceled ||
      !importFileDialogResult.filePaths ||
      importFileDialogResult.filePaths.length === 0
    ) {
      return;
    }

    const importFileContents = fs
      .readFileSync(path.normalize(importFileDialogResult.filePaths[0]))
      .toString('utf-8');

    let importedFileData: ImportedFileData = {};

    try {
      importedFileData = JSON.parse(importFileContents);
    } catch (error) {
      importedFileData = {};
    }

    if (
      !Object.prototype.hasOwnProperty.call(importedFileData, 'budgets') &&
      !Object.prototype.hasOwnProperty.call(importedFileData, 'expenses')
    ) {
      showAlert(
        'Error!',
        'Could not parse the file. Please confirm what you chose is correct.',
      );
      return;
    }

    const budgets = importedFileData.budgets || [];
    const expenses = importedFileData.expenses || [];

    const cancelButtonIndex = 0;
    const mergeButtonIndex = 1;
    const replaceButtonIndex = 2;

    const mergeOrReplaceDialogResult = await remote.dialog.showMessageBox({
      type: 'question',
      title: 'Merge or Replace?',
      message:
        'Do you want to merge this with your existing data, or replace it?',
      buttons: ['Wait, cancel.', 'Merge', 'Replace'],
      defaultId: replaceButtonIndex,
      cancelId: cancelButtonIndex,
    });

    if (
      [mergeButtonIndex, replaceButtonIndex].includes(
        mergeOrReplaceDialogResult.response,
      )
    ) {
      this.setState({ isSubmitting: true });
      const success = await onImportData(
        mergeOrReplaceDialogResult.response === replaceButtonIndex,
        budgets,
        expenses,
      );
      this.setState({ isSubmitting: false });
      if (success) {
        onClose();
      }
    }
  };

  onRequestExport = async () => {
    const { onExportData, showNotification } = this.props;
    const { isSubmitting } = this.state;

    if (isSubmitting) {
      // Ignore sequential taps
      return;
    }

    const fileName = `data-export-${new Date()
      .toISOString()
      .substr(0, 19)
      .replace(/:/g, '-')}.json`;

    const importFilePathDialogResult = await remote.dialog.showSaveDialog({
      title: 'Choose where to create the JSON file',
      defaultPath: fileName,
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });

    if (
      !importFilePathDialogResult ||
      importFilePathDialogResult.canceled ||
      !importFilePathDialogResult.filePath
    ) {
      return;
    }

    const exportData = await onExportData();

    const exportContents = JSON.stringify(exportData, null, 2);

    this.setState({ isSubmitting: true });
    fs.writeFileSync(
      path.normalize(importFilePathDialogResult.filePath),
      exportContents,
    );
    this.setState({ isSubmitting: false });
    showNotification('Data exported successfully!');
  };

  render() {
    const { isOpen, onClose } = this.props;

    return (
      <Rodal visible={isOpen} onClose={onClose} animation="slideDown">
        <Container>
          <Label>Import</Label>
          <Note>Import a JSON file exported from Budgets before.</Note>

          <StyledButton
            onClick={() => this.onLearnMore()}
            text="Learn more"
            type="secondary"
          />

          <StyledButton
            onClick={() => this.onRequestImport()}
            text="Import Data"
            type="secondary"
          />

          <StyledButton
            onClick={() => this.onRequestExport()}
            text="Export Data"
            type="primary"
          />
        </Container>
      </Rodal>
    );
  }
}

export default ImportExportModal;
