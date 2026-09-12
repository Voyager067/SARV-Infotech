import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import AnimatedBackground from "./components/AnimatedBackground";
import CartDrawer from "./components/CartDrawer";
import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";

const App = () => {
  const location = useLocation();

  return (
    <div className="cursor-none-fine flex min-h-screen flex-col">
      <AnimatedBackground />
      <CustomCursor />
      <Navbar />
      <CartDrawer />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/products" element={<PageTransition><ProductsPage /></PageTransition>} />
            <Route path="/products/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CheckoutPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success/:id"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <OrderSuccessPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <OrdersPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default App;
