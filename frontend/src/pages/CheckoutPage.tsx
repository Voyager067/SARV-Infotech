import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, MapPin, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";
import { selectCartTotal, useCartStore } from "../store/cartStore";
import { PaymentDetails, ShippingDetails } from "../types";

const STEPS = ["Shipping", "Payment", "Review"] as const;

const emptyShipping: ShippingDetails = { fullName: "", address: "", city: "", postalCode: "", phone: "" };
const emptyPayment: PaymentDetails = { cardholderName: "", cardNumber: "", expiry: "", cvv: "" };

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const CheckoutPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const total = useCartStore(selectCartTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [stepIndex, setStepIndex] = useState(0);
  const [shipping, setShipping] = useState<ShippingDetails>(emptyShipping);
  const [payment, setPayment] = useState<PaymentDetails>(emptyPayment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleShippingSubmit = (event: FormEvent) => {
    event.preventDefault();
    goNext();
  };

  const handlePaymentSubmit = (event: FormEvent) => {
    event.preventDefault();
    goNext();
  };

  const handlePlaceOrder = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const res = await api.post("/orders", {
        items,
        shipping,
        payment: {
          cardholderName: payment.cardholderName,
          cardNumber: payment.cardNumber,
          expiry: payment.expiry,
        },
      });
      clearCart();
      navigate(`/order-success/${res.data._id}`);
    } catch {
      setError("Something went wrong placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-white/60">Your cart is empty — nothing to check out yet.</p>
        <button onClick={() => navigate("/products")} className="mt-4 text-cyan-300 hover:underline">
          Browse products
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 pb-24 pt-12 md:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="mb-8 flex items-center gap-3">
          {STEPS.map((step, index) => (
            <div key={step} className="flex flex-1 items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${
                  index <= stepIndex ? "bg-gradient-to-r from-violet-500 to-cyan-400 text-black" : "bg-white/10 text-white/40"
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-sm ${index <= stepIndex ? "text-white" : "text-white/40"}`}>{step}</span>
              {index < STEPS.length - 1 && <div className="h-px flex-1 bg-white/10" />}
            </div>
          ))}
        </div>

        <div className="glass glow-border overflow-hidden rounded-3xl p-8">
          <AnimatePresence mode="wait">
            {stepIndex === 0 && (
              <motion.form
                key="shipping"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                onSubmit={handleShippingSubmit}
                className="space-y-4"
              >
                <div className="mb-2 flex items-center gap-2 text-white/70">
                  <MapPin className="h-4 w-4" /> Shipping details
                </div>
                <input
                  required
                  placeholder="Full name"
                  value={shipping.fullName}
                  onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-cyan-300/50"
                />
                <input
                  required
                  placeholder="Address"
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-cyan-300/50"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    placeholder="City"
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-cyan-300/50"
                  />
                  <input
                    required
                    placeholder="Postal code"
                    value={shipping.postalCode}
                    onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-cyan-300/50"
                  />
                </div>
                <input
                  required
                  placeholder="Phone"
                  value={shipping.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-cyan-300/50"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 py-3 font-semibold text-black transition hover:brightness-110"
                >
                  Continue to payment
                </button>
              </motion.form>
            )}

            {stepIndex === 1 && (
              <motion.form
                key="payment"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                onSubmit={handlePaymentSubmit}
                className="space-y-4"
              >
                <div className="mb-2 flex items-center gap-2 text-white/70">
                  <CreditCard className="h-4 w-4" /> Payment details
                </div>
                <input
                  required
                  placeholder="Cardholder name"
                  value={payment.cardholderName}
                  onChange={(e) => setPayment({ ...payment, cardholderName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-cyan-300/50"
                />
                <input
                  required
                  placeholder="Card number"
                  value={payment.cardNumber}
                  onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono tracking-widest outline-none focus:border-cyan-300/50"
                  maxLength={19}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    placeholder="MM/YY"
                    value={payment.expiry}
                    onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-cyan-300/50"
                    maxLength={5}
                  />
                  <input
                    required
                    placeholder="CVV"
                    value={payment.cvv}
                    onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-cyan-300/50"
                    maxLength={3}
                  />
                </div>
                <p className="flex items-center gap-1.5 text-xs text-white/30">
                  <ShieldCheck className="h-3.5 w-3.5" /> This is a demo checkout — no real payment is processed.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex-1 rounded-xl border border-white/10 py-3 font-medium text-white/70 hover:border-white/30"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 py-3 font-semibold text-black transition hover:brightness-110"
                  >
                    Review order
                  </button>
                </div>
              </motion.form>
            )}

            {stepIndex === 2 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-5"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">Shipping to</p>
                  <p className="mt-1 text-sm text-white/80">
                    {shipping.fullName}, {shipping.address}, {shipping.city} {shipping.postalCode}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">Paying with</p>
                  <p className="mt-1 text-sm text-white/80">
                    {payment.cardholderName} · **** **** **** {payment.cardNumber.replace(/\s/g, "").slice(-4)}
                  </p>
                </div>

                {error && <p className="text-sm text-red-300">{error}</p>}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex-1 rounded-xl border border-white/10 py-3 font-medium text-white/70 hover:border-white/30"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
                  >
                    {isSubmitting ? "Placing order..." : `Pay ${formatPrice(total)}`}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="glass h-fit rounded-3xl p-6">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1 text-sm">
                <p>{item.name}</p>
                <p className="text-white/40">Qty {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 font-display text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
