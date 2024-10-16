import * as React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@app/routes';
import '@app/app.css';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/virtual-assistant/dist/css/main.css';

const App: React.FunctionComponent = () => <RouterProvider router={router} />;

export default App;
