import { BrowserWindow, dialog, ipcMain } from 'electron';
import { AppUpdater } from 'electron-updater';
import { ParentService } from './parentService';
import fs from 'fs';
import path from 'path';
import { formatEther, getAbiItem, parseAbi, parseEther } from 'viem';
import { formatAbi } from 'abitype';
import { DeployContractParam } from '../../renderer/routes/DashboardContractDeployRoute';
import { ChainConfigType } from '../../renderer/states/chain/reducer';
import { getPublicClient, getWalletClient } from '../../shared/utils/client';

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
  contractDirectory?: string;
};

export type InputAbiItem = {
  type: ContractInputType;
  name?: string;
  internalType?: string;
};
export type outputAbiItem = {
  type: ContractOutputType;
  name?: string;
  internalType?: string;
};

export type AbiItem = {
  type: string;
  name?: string;
  inputs?: InputAbiItem[];
  outputs?: outputAbiItem[];
  stateMutability?: string;
  anonymous?: boolean;
};

export type SmartContractAbi = {
  abi: AbiItem[];
  contractName?: string;
  bytecode: string;
  deployedBytecode: string;
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
        this.getAbi(type);

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

    ipcMain.handle(
      'deploy-contract',
      async (
        _,
        payload: {
          chain: ChainConfigType;
          contract: DeployContractParam;
          abiJson: AbiJson;
        },
      ) => {
        try {
          const privateKey = payload.contract.account!.privateKey;
          const publicClient = getPublicClient(payload.chain);
          const client = getWalletClient(payload.chain, privateKey);
          const abi = payload.abiJson.content!.abi;
          const value = payload.contract.value;
          const account = payload.contract.account!.publicKey;

          const valuePass = parseEther(value);
          console.log({ valuePass });
          const tx = await client.deployContract({
            value: valuePass,
            account,
            abi: abi,
            args: payload.contract.inputValue || [],
            bytecode: payload.abiJson.content!.bytecode as `0x${string}`,
          });

          // wait transaction success
          const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
          });

          if (receipt.status !== 'success') {
            return {
              isSuccess: false,
              receipt: undefined,
              error: {
                message: 'transaction revert',
              },
            };
          }

          return {
            isSuccess: true,
            receipt,
            payload: payload,
            error: undefined,
          };
        } catch (error) {
          console.error('Error deploy contract:', error);

          return {
            isSuccess: false,
            receipt: undefined,
            error: error,
          };
        }
      },
    );

    ipcMain.handle('upload-abi', async (_) => {
      try {
        const result = await dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [{ name: 'JSON', extensions: ['json'] }],
        });

        if (result.canceled) {
          return {
            isSuccess: false,
            message: 'Please select an ABI JSON file',
          };
        }

        const filePath = result.filePaths[0];
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jsonContent = JSON.parse(fileContent) as SmartContractAbi;
        const name =
          jsonContent?.contractName || path.basename(filePath, '.json');

        const bytecode =
          jsonContent.bytecode || (jsonContent.bytecode as any).object;

        jsonContent.bytecode = bytecode;

        const abiJson = {
          name,
          path: filePath,
          content: jsonContent,
          isValid: false,
        };

        if (abiJson.content) {
          abiJson.isValid = this.checkJson(abiJson.content);
        }

        if (!abiJson.isValid) {
          return {
            isSuccess: false,
            message: 'Invalid ABI JSON file format',
          };
        }

        return {
          isSuccess: true,
          message: 'success',
          jsonFiles: [abiJson],
          contractDirectory: filePath,
        };
      } catch (error) {
        console.error('Error uploading ABI:', error);
        return {
          isSuccess: false,
          message: 'Error uploading ABI file',
        };
      }
    });
  }

  getAbi(type: 'hardhat' | 'foundry') {
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
            const name = jsonContent?.contractName || file.replace('.json', '');
            if (type === 'foundry') {
              const bytecode = (jsonContent.bytecode as any).object;
              const deployedBytecode = (jsonContent.deployedBytecode as any)
                .object;
              jsonContent.bytecode = bytecode;
              jsonContent.deployedBytecode = deployedBytecode;
            }
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
      !Array.isArray(jsonContent.abi) ||
      !jsonContent.bytecode
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
