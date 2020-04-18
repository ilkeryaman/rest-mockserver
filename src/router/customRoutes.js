import addressRoutes from './customRoutes/addressRoutes';
import exampleConfigurationRoutes from './customRoutes/exampleConfigurationRoutes';

const customRoutes = [
    ...addressRoutes,
    ...exampleConfigurationRoutes
]

export default customRoutes;