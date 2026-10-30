import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { restaurant } from '../data/restaurant';
import { submitReservation } from '../api';
import { formatSlot, parseLocalDate, todayISO } from '../lib/format';

interface FormState {
  name: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
}

type FieldName = keyof FormState;
type FormErrors = Partial<Record<FieldName, string>>;
type Status = 'idle' | 'sending' | 'sent' | 'failed';

const fieldOrder: FieldName[] = ['name', 'email', 'date', 'time', 'guests'];

const emptyForm: FormState = {
  name: '',
  email: '',
  date: '',
  time: '',
  guests: '2',
  notes: '',
};

function weekdayName(day: number): string {
  // 2023-01-01 was a Sunday, so day 0 maps to the 1st.
  return new Intl.DateTimeFormat(restaurant.locale, { weekday: 'long' }).format(
    new Date(2023, 0, 1 + day),
  );
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Enter a name for the booking.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter an email address we can send the confirmation to.';
  }

  if (!values.date) {
    errors.date = 'Choose a date.';
  } else if (values.date < todayISO()) {
    errors.date = 'Choose today or a later date.';
  } else {
    const day = parseLocalDate(values.date).getDay();
    if (restaurant.closedWeekdays.includes(day)) {
      errors.date = `We\u2019re closed on ${weekdayName(day)}s. Choose another day.`;
    }
  }

  if (!values.time) {
    errors.time = 'Choose a time.';
  }

  const guests = Number(values.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > restaurant.maxOnlineParty) {
    errors.guests = `Choose between 1 and ${restaurant.maxOnlineParty} guests.`;
  }

  return errors;
}

export function Reserve() {
  const [values, setValues] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [reference, setReference] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const name = event.target.name as FieldName;
    const value = event.target.value;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);

    const firstInvalid = fieldOrder.find((field) => found[field]);
    if (firstInvalid) {
      (formRef.current?.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    setStatus('sending');
    try {
      const result = await submitReservation({
        name: values.name.trim(),
        email: values.email.trim(),
        date: values.date,
        time: values.time,
        guests: Number(values.guests),
        notes: values.notes.trim() || undefined,
      });
      setReference(result.reference);
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  }

  function reset() {
    setValues(emptyForm);
    setErrors({});
    setStatus('idle');
    setReference('');
  }

  const guestOptions = Array.from({ length: restaurant.maxOnlineParty }, (_, i) => i + 1);

  const prettyDate =
    values.date &&
    new Intl.DateTimeFormat(restaurant.locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(parseLocalDate(values.date));

  return (
    <section className="section section--accent" id="reserve" aria-labelledby="reserve-title">
      <div className="wrap reserve__grid">
        <div className="reserve__copy">
          <h2 id="reserve-title">Book a table</h2>
          <p>
            Tables are held for 15 minutes. The last seating is at{' '}
            {formatSlot(restaurant.slots[restaurant.slots.length - 1])}.
          </p>
          <p>
            Booking for more than {restaurant.maxOnlineParty}, or celebrating something? Call{' '}
            <a href={`tel:${restaurant.phone.replace(/\s/g, '')}`}>{restaurant.phone}</a>.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="confirmation" role="status">
            <h3>Table booked</h3>
            <p>
              {values.guests} {Number(values.guests) === 1 ? 'guest' : 'guests'} on {prettyDate} at{' '}
              {formatSlot(values.time)}. We&rsquo;ve sent a confirmation to {values.email}.
            </p>
            <p className="confirmation__ref">Booking reference: {reference}</p>
            <button type="button" className="btn btn--dark" onClick={reset}>
              Book another table
            </button>
          </div>
        ) : (
          <form className="form" ref={formRef} onSubmit={handleSubmit} noValidate>
            <Field label="Name" error={errors.name} id="res-name">
              <input
                id="res-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'res-name-error' : undefined}
              />
            </Field>

            <Field label="Email" error={errors.email} id="res-email">
              <input
                id="res-email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'res-email-error' : undefined}
              />
            </Field>

            <div className="form__row">
              <Field label="Date" error={errors.date} id="res-date">
                <input
                  id="res-date"
                  name="date"
                  type="date"
                  min={todayISO()}
                  value={values.date}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={errors.date ? 'res-date-error' : undefined}
                />
              </Field>

              <Field label="Time" error={errors.time} id="res-time">
                <select
                  id="res-time"
                  name="time"
                  value={values.time}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.time)}
                  aria-describedby={errors.time ? 'res-time-error' : undefined}
                >
                  <option value="">Choose a time</option>
                  {restaurant.slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatSlot(slot)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Guests" error={errors.guests} id="res-guests">
                <select
                  id="res-guests"
                  name="guests"
                  value={values.guests}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.guests)}
                  aria-describedby={errors.guests ? 'res-guests-error' : undefined}
                >
                  {guestOptions.map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Allergies or special requests (optional)" id="res-notes">
              <textarea
                id="res-notes"
                name="notes"
                rows={3}
                value={values.notes}
                onChange={handleChange}
              />
            </Field>

            {status === 'failed' && (
              <p className="form__error" role="alert">
                We couldn&rsquo;t send your booking. Check your connection and try again, or call{' '}
                {restaurant.phone}.
              </p>
            )}

            <button type="submit" className="btn btn--dark" disabled={status === 'sending'}>
              {status === 'sending' ? 'Booking\u2026' : 'Book this table'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
