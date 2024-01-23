import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import ProductsRoute from '@routes/products.route';
import validateEnv from '@utils/validateEnv';
import WebSocketManager from '@socket/index.socket';

validateEnv();

const wsSocket = new WebSocketManager();
const app = new App(wsSocket, [new IndexRoute(), new UsersRoute(), new ProductsRoute(wsSocket), new AuthRoute(wsSocket)]);

app.listen();
