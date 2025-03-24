import { BrowserWindow, dialog, ipcMain } from 'electron';
import { AppUpdater } from 'electron-updater';
import { ParentService } from './parentService';
import fs from 'fs';
import path from 'path';
import { getAbiItem, parseAbi } from 'viem';
import { formatAbi } from 'abitype';

export interface AbiJson {
  name: string;
  path: string;
  content?: SmartContractAbi;
  isValid: boolean;
}

const ContractInputList = [
  'address',
  'bool',
  'string',
  'bytes',
  'uint256',
  'uint8',
  'uint',
  'int256',
  'int8',
  'int',
] as const;

const ContractOutputList = [
  'address',
  'bool',
  'string',
  'bytes',
  'uint256',
  'uint8',
  'uint',
  'int256',
  'int8',
  'int',
] as const;

type ContractInputType = (typeof ContractInputList)[number];
type ContractOutputType = (typeof ContractOutputList)[number];

export type setDirectoryResponse = {
  isSuccess: boolean;
  message: string;
  jsonFiles?: AbiJson[];
  contractDirectory: string;
};

export type AbiItem = {
  type: string;
  name?: string;
  inputs?: { type: ContractInputType; name?: string; internalType?: string }[];
  outputs?: {
    type: ContractOutputType;
    name?: string;
    internalType?: string;
  }[];
  stateMutability?: string;
  anonymous?: boolean;
};

type SmartContractAbi = {
  abi: AbiItem[];
  contractName?: string;
};

export class ContractService extends ParentService {
  jsonFiles: AbiJson[] = [];
  contractDirectory = '';

  constructor(window: BrowserWindow, appUpdater: AppUpdater) {
    super(window, appUpdater);
    this.registerEvents();
  }

  registerEvents() {
    ipcMain.handle('set-directory', async (_, type: 'hardhat' | 'foundry') => {
      try {
        const result = await dialog.showOpenDialog({
          properties: ['openDirectory'],
        });

        if (result.canceled) {
          return {
            isSuccess: false,
            message: 'Please select directory of contracts',
          };
        }

        this.contractDirectory = result.filePaths[0];
        this.jsonFiles = [];
        this.getAbiHardhat();

        return {
          isSuccess: true,
          message: 'success',
          jsonFiles: this.jsonFiles,
          contractDirectory: this.contractDirectory,
        };
      } catch (error) {
        return {
          isSuccess: false,
          message: 'Please select directory of contracts',
        };
      }
    });
  }

  getAbiHardhat() {
    const folders = fs.readdirSync(this.contractDirectory);
    for (const folder of folders) {
      const folderPath = path.join(this.contractDirectory, folder);
      const files = fs.readdirSync(folderPath);

      for (const file of files) {
        if (file.endsWith('.json') && !file.includes('.dbg.json')) {
          const filePath = path.join(this.contractDirectory, folder, file);
          try {
            // Read file content
            const fileContent = fs.readFileSync(filePath, 'utf8');
            // Parse JSON to verify it's valid
            const jsonContent = JSON.parse(fileContent) as SmartContractAbi;
            // Add to result
            const name = jsonContent?.contractName || file;
            this.jsonFiles.push({
              name,
              path: filePath,
              content: jsonContent,
              isValid: false,
            });
          } catch (error) {
            console.log(`Error reading JSON file ${file}:`, error);
            // Add file with error information
            this.jsonFiles.push({
              name: file,
              path: filePath,
              content: undefined,
              isValid: false,
            });
          }
        }
      }

      // Check validity of each JSON file
      for (const jsonFile of this.jsonFiles) {
        if (jsonFile.content) {
          jsonFile.isValid = this.checkJson(jsonFile.content);
        }
      }
      this.removeInterfaceContracts();
    }
  }

  checkJson(jsonContent: any): jsonContent is SmartContractAbi {
    if (
      !jsonContent ||
      typeof jsonContent !== 'object' ||
      !jsonContent.abi ||
      !Array.isArray(jsonContent.abi)
    ) {
      return false;
    }

    try {
      const abi = jsonContent.abi;
      const result = formatAbi(abi);
      // console.log(result);
      return true;
    } catch (err) {
      // console.log(err);
      return false;
    }
  }

  removeInterfaceContracts() {
    const baseNames = new Set<string>();

    // Collect all base names that have a corresponding non-interface version
    for (const jsonFile of this.jsonFiles) {
      if (!jsonFile.name.startsWith('I')) {
        baseNames.add(jsonFile.name);
      }
    }

    // Filter out the interface versions if a non-interface version exists
    this.jsonFiles = this.jsonFiles.filter((jsonFile) => {
      const baseName = jsonFile.name.startsWith('I')
        ? jsonFile.name.substring(1)
        : jsonFile.name;
      return !jsonFile.name.startsWith('I') || !baseNames.has(baseName);
    });
  }
}
