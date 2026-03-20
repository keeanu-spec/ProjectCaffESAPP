import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Vistas públicas
import Login    from './Pages/Login';
import Register from './Pages/Register';

// Vistas de cliente
import MenuCatalog   from './Pages/MenuCatalog';
import ProductDetail from './Pages/ProductDetail';
import Checkout      from './Pages/Checkout';
import MyOrders      from './Pages/MyOrders';
import UserProfile   from './Pages/UserProfile';

// Vista de empleado
import OrderManagement from './Pages/OrderManagement';

// Panel de administración (subrutas internas)
import AdminApp from './Pages/Admin/AdminApp';

function App() {
    return (
        <Router>
            <Routes>
                {/* Públicas */}
                <Route path="/"         element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Cliente */}
                <Route path="/menu"        element={<MenuCatalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout"    element={<Checkout />} />
                <Route path="/orders"      element={<MyOrders />} />
                <Route path="/profile"     element={<UserProfile />} />

                {/* Empleado */}
                <Route path="/employee/orders" element={<OrderManagement />} />

                {/* Admin — subrutas gestionadas por AdminApp */}
                <Route path="/admin/*" element={<AdminApp />} />
            </Routes>
        </Router>
    );
}

export default App;
