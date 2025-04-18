import { Provider as ReduxToolkitProvider } from 'react-redux';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Initialization from './Initialization';
import DashboardAccountRoute from './routes/DashboardAccountRoute';
import DashboardMain from './routes/DashboardMain';
import ProjectCreate from './routes/ProjectCreate';
import ProjectRoute from './routes/ProjectRoute';
import DashboardTransactionsRoute from './routes/TransactionsRoute';
import { store } from './states/store';

import ProjectChecking from './routes/ProjectChecking';
import ProjectLoading from './routes/ProjectLoading';

import 'sweetalert2/dist/sweetalert2.css';
import DashboardDeployContractsRoute from './routes/DashboardContractDeployRoute';
import DashboardEventDetailRoute from './routes/DashboardEventDetail';
import DashboardEventsRoute from './routes/DashboardEventsRoute';
import DashboardLogsRoute from './routes/DashboardLogsRoute';
import './styles/App.css';
import DashboardContractRoute from './routes/DashboardContractRoute';
import DashboardContractDetailRoute from './routes/DashboardContractDetailRoute';

export default function App() {
  return (
    <ReduxToolkitProvider store={store}>
      <Initialization />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ProjectChecking />} />
            <Route path="/project" element={<ProjectRoute />} />
            <Route path="/create" element={<ProjectCreate />} />
            <Route path="/loading" element={<ProjectLoading />} />
            {/* dashboard */}
            <Route path="/dashboard/main" element={<DashboardMain />} />
            <Route
              path="/dashboard/accounts/:layer/:chainId"
              element={<DashboardAccountRoute />}
            />
            <Route
              path="/dashboard/transactions/:layer/:chainId"
              element={<DashboardTransactionsRoute />}
            />
            <Route
              path="/dashboard/logs/:layer/:chainId"
              element={<DashboardLogsRoute />}
            />

            <Route
              path="/dashboard/contracts/:layer/:chainId"
              element={<DashboardContractRoute />}
            />
            <Route
              path="/dashboard/predeploy-contracts/:layer/:chainId"
              element={<DashboardContractRoute isPredeploy={true} />}
            />
            <Route
              path="/dashboard/contracts/:layer/:chainId/deploy"
              element={<DashboardDeployContractsRoute />}
            />

            <Route
              path="/dashboard/contracts/:layer/:chainId/:contractAddress"
              element={<DashboardContractDetailRoute />}
            />

            <Route
              path="/dashboard/events/:layer/:chainId"
              element={<DashboardEventsRoute />}
            />
          </Routes>
        </Layout>
      </Router>
    </ReduxToolkitProvider>
  );
}
