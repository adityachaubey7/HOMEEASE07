import { useState } from 'react';
import { Button, Modal } from '@/components/ui';
import { useAuth, useToast } from '@/context/AppProviders';
import { authApi } from '@/services/api';
import { USE_MOCK } from '@/services/http';

export default function AuthModal() {
  const { authOpen, closeAuth, signIn } = useAuth();
  const toast = useToast();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const reset = () => { setStep('phone'); setCode(''); setError(''); };
  const close = () => { closeAuth(); reset(); };

  async function sendOtp(e) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) { setError('Enter a 10-digit Indian mobile number starting with 6–9.'); return; }
    setBusy(true); setError('');
    try { await authApi.requestOtp(phone); setStep('otp'); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  async function verify(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const { user } = await authApi.verifyOtp(phone, code);
      signIn(user);
      toast('You’re logged in');
      reset();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  return (
    <Modal open={authOpen} onClose={close} title={step === 'phone' ? 'Log in or sign up' : 'Enter the 4-digit code'} size="sm">
      {step === 'phone' ? (
        <form className="form" onSubmit={sendOtp} noValidate>
          <p className="muted">We’ll text you a code. Your number is shared with the professional only after a booking is confirmed.</p>
          <label className="field">
            <span className="field__label">Mobile number</span>
            <span className="field__phone">
              <span className="field__prefix">+91</span>
              <input id="auth-phone" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="98765 43210" aria-invalid={!!error} />
            </span>
          </label>
          {error && <p className="field__error" role="alert">{error}</p>}
          <Button type="submit" block loading={busy}>Send code</Button>
        </form>
      ) : (
        <form className="form" onSubmit={verify} noValidate>
          <p className="muted">Sent to +91 {phone}. <button type="button" className="link-btn" onClick={reset}>Change number</button></p>
          <label className="field">
            <span className="field__label">Code</span>
            <input id="auth-otp" className="otp-input" inputMode="numeric" maxLength={4} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="• • • •" aria-invalid={!!error} />
          </label>
          {USE_MOCK ? <p className="hint">Demo mode: use code <strong>1234</strong>.</p> : import.meta.env.DEV && <p className="hint">Local development: the code is printed in the server terminal.</p>}
          {error && <p className="field__error" role="alert">{error}</p>}
          <Button type="submit" block loading={busy} disabled={code.length !== 4}>Verify and continue</Button>
        </form>
      )}
    </Modal>
  );
}
