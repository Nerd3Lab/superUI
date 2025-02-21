import { ipcMain, BrowserWindow } from 'electron';
import { TimeService } from './timeService';
import { AccountService } from './accountService';
import { FoundryService } from './foundryService';
import { SupersimService } from './supersimService';
import { AppService } from './appService';
import { AppUpdater } from 'electron-updater';
import { TransactionService } from './transactionService';
import { LoggingService } from './loggingService';

export class IpcHandler {
  private timeService: TimeService;
  private accountService: AccountService;
  private foundryService: FoundryService;
  private supersimService: SupersimService;
  private appService: AppService;
  private transactionService: TransactionService;
  private loggingService: LoggingService;

  constructor(window: BrowserWindow, appUpdater: AppUpdater) {
    this.timeService = new TimeService(window, appUpdater);
    this.accountService = new AccountService(window, appUpdater);
    this.foundryService = new FoundryService(window, appUpdater);
    this.transactionService = new TransactionService(window, appUpdater);
    this.supersimService = new SupersimService(
      window,
      appUpdater,
      this.transactionService,
    );
    this.appService = new AppService(window, appUpdater);
    this.loggingService = new LoggingService(window, appUpdater);
  }
}
