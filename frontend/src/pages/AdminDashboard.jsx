import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import '../styles/admin.css'; // ensure this exists (from previous step)

/*
  Fixed AdminDashboard.jsx
  - Prevents edit-lock by using safe state initialization
  - Uses functional setState updates to avoid stale/overwritten state
  - Clears __errors on input changes
  - Uses nullish coalescing (??) for input values
  - Keeps same ResourceEditor API (onCreate, onUpdate, onDelete, fields, validators)
*/

function useFormState(initial = {}) {
  const [form, setForm] = useState({ ...initial, __errors: {} });
  // helper that patches and clears errors
  const patch = (patchObj) => setForm(prev => ({ ...prev, ...patchObj, __errors: {} }));
  return [form, patch, setForm];
}

function Field({ label, children, error, hint }) {
  return (
    <div className="adm-field">
      <label className="adm-label">{label}</label>
      <div>{children}</div>
      {hint && <div className="adm-hint">{hint}</div>}
      {error && <div className="adm-error">{error}</div>}
    </div>
  );
}

function ResourceEditor({ title, items = [], onCreate, onUpdate, onDelete, fields = [], validators = {} }) {
  const [editing, setEditing] = useState(null);
  const [form, patchForm, setForm] = useFormState({});

  // Safe initialize/clear when editing toggles
  useEffect(() => {
    if (editing) {
      // create a shallow copy and ensure __errors exists
      setForm({ ...editing, __errors: {} });
    } else {
      setForm({ __errors: {} });
    }
  }, [editing, setForm]);

  const validate = () => {
    const errors = {};
    for (const key of Object.keys(validators || {})) {
      const fn = validators[key];
      try {
        const msg = fn(form[key], form);
        if (msg) errors[key] = msg;
      } catch (e) {
        // ignore validator exceptions but surface a message
        errors[key] = 'Invalid';
      }
    }
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    if (Object.keys(errors).length) {
      // store errors in form to show inline
      patchForm({ __errors: errors });
      return;
    }
    try {
      if (editing) {
        await onUpdate(editing._id, form);
        setEditing(null);
      } else {
        await onCreate(form);
      }
      // clear form after success
      setForm({ __errors: {} });
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || 'Save failed';
      alert(msg);
    }
  };

  const err = (field) => form.__errors?.[field];

  // generic input change handler to avoid repeated code
  const handleChange = (key, value) => {
    patchForm({ [key]: value });
  };

  return (
    <section className="adm-resource" aria-label={title}>
      <div className="adm-left">
        <h3>{title}</h3>
        <div className="adm-list">
          {items.length === 0 && <div className="adm-muted">No items</div>}
          {items.map(it => (
            <div key={it._id} className="adm-item">
              <div className="adm-item-title">{it.name || it.type || it._id}</div>
              <div className="adm-item-actions">
                <button className="btn btn-ghost" onClick={() => setEditing(it)}>Edit</button>
                <button className="btn btn-danger" onClick={() => { if (confirm('Delete?')) onDelete(it._id); }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="adm-right">
        <h4>{editing ? 'Edit' : 'Create'}</h4>

        {/* Name */}
        {fields.includes('name') && (
          <Field label="Name" error={err('name')}>
            <input
              type="text"
              className="inp"
              value={form.name ?? ''}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Field>
        )}

        {/* Type (court/equipment/rule types) */}
        {fields.includes('type') && (
          <Field label="Type" error={err('type')}>
            <select
              className="inp"
              value={form.type ?? ''}
              onChange={e => handleChange('type', e.target.value)}
            >
              <option value="">-- select --</option>
              {/* provide common options; backend accepts other strings for rules */}
              <option value="indoor">indoor</option>
              <option value="outdoor">outdoor</option>
              <option value="racket">racket</option>
              <option value="shoes">shoes</option>
              <option value="peak">peak</option>
              <option value="weekend">weekend</option>
              <option value="indoorPremium">indoorPremium</option>
            </select>
          </Field>
        )}

        {/* basePrice */}
        {fields.includes('basePrice') && (
          <Field label="Base price" hint="Enter a number (USD)" error={err('basePrice')}>
            <input
              type="number"
              min="0"
              className="inp"
              value={form.basePrice ?? ''}
              onChange={e => {
                const v = e.target.value === '' ? '' : Number(e.target.value);
                handleChange('basePrice', v);
              }}
            />
          </Field>
        )}

        {/* hourlyRate */}
        {fields.includes('hourlyRate') && (
          <Field label="Hourly rate" hint="Coach hourly rate (USD)" error={err('hourlyRate')}>
            <input
              type="number"
              min="0"
              className="inp"
              value={form.hourlyRate ?? ''}
              onChange={e => handleChange('hourlyRate', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </Field>
        )}

        {/* totalStock */}
        {fields.includes('totalStock') && (
          <Field label="Total stock" error={err('totalStock')}>
            <input
              type="number"
              min="0"
              className="inp"
              value={form.totalStock ?? ''}
              onChange={e => handleChange('totalStock', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </Field>
        )}

        {/* pricePerUnit */}
        {fields.includes('pricePerUnit') && (
          <Field label="Price per unit" error={err('pricePerUnit')}>
            <input
              type="number"
              step="0.01"
              min="0"
              className="inp"
              value={form.pricePerUnit ?? ''}
              onChange={e => handleChange('pricePerUnit', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </Field>
        )}

        {/* startHour / endHour */}
        {fields.includes('startHour') && (
          <Field label="Start hour (0-23)" error={err('startHour')}>
            <input
              type="number"
              min="0"
              max="23"
              className="inp"
              value={form.startHour ?? ''}
              onChange={e => handleChange('startHour', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </Field>
        )}

        {fields.includes('endHour') && (
          <Field label="End hour (0-23)" error={err('endHour')}>
            <input
              type="number"
              min="0"
              max="23"
              className="inp"
              value={form.endHour ?? ''}
              onChange={e => handleChange('endHour', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </Field>
        )}

        {/* multiplier */}
        {fields.includes('multiplier') && (
          <Field label="Multiplier" hint="Use 1 for normal price, <1 for discount, >1 for surcharge" error={err('multiplier')}>
            <input
              type="number"
              step="0.1"
              className="inp"
              value={form.multiplier ?? ''}
              onChange={e => handleChange('multiplier', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </Field>
        )}

        {/* surcharge */}
        {fields.includes('surcharge') && (
          <Field label="Surcharge" hint="Flat fee (USD)" error={err('surcharge')}>
            <input
              type="number"
              step="0.01"
              className="inp"
              value={form.surcharge ?? ''}
              onChange={e => handleChange('surcharge', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </Field>
        )}

        {/* enabled toggle */}
        {fields.includes('enabled') && (
          <Field label="Enabled">
            <label className="toggle">
              <input
                type="checkbox"
                checked={!!form.enabled}
                onChange={e => handleChange('enabled', !!e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </Field>
        )}

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</button>
          {editing && <button className="btn" style={{ marginLeft: 8 }} onClick={() => setEditing(null)}>Cancel</button>}
        </div>
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [rules, setRules] = useState([]);
  const [notice, setNotice] = useState('');

  const loadAll = async () => {
    try {
      const [r1, r2, r3, r4] = await Promise.all([
        api.get('/courts'),
        api.get('/coaches'),
        api.get('/equipment'),
        api.get('/pricing'),
      ]);
      setCourts(r1.data || []);
      setCoaches(r2.data || []);
      setEquipment(r3.data || []);
      setRules(r4.data || []);
      setNotice('');
    } catch (e) {
      console.error(e);
      setNotice('Failed to load resources. Is backend running?');
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // COURTS
  const createCourt = async (body) => { await api.post('/courts', body); setNotice('Court created'); await loadAll(); };
  const updateCourt = async (id, body) => { await api.put('/courts/' + id, body); setNotice('Court updated'); await loadAll(); };
  const deleteCourt = async (id) => { if (confirm('Delete court?')) { await api.delete('/courts/' + id); setNotice('Court deleted'); await loadAll(); } };

  // COACHES
  const createCoach = async (body) => { await api.post('/coaches', body); setNotice('Coach created'); await loadAll(); };
  const updateCoach = async (id, body) => { await api.put('/coaches/' + id, body); setNotice('Coach updated'); await loadAll(); };
  const deleteCoach = async (id) => { if (confirm('Delete coach?')) { await api.delete('/coaches/' + id); setNotice('Coach deleted'); await loadAll(); } };

  // EQUIPMENT
  const createEquip = async (body) => { await api.post('/equipment', body); setNotice('Equipment created'); await loadAll(); };
  const updateEquip = async (id, body) => { await api.put('/equipment/' + id, body); setNotice('Equipment updated'); await loadAll(); };
  const deleteEquip = async (id) => { if (confirm('Delete equipment?')) { await api.delete('/equipment/' + id); setNotice('Equipment deleted'); await loadAll(); } };

  // RULES
  const createRule = async (body) => { await api.post('/pricing', body); setNotice('Rule created'); await loadAll(); };
  const updateRule = async (id, body) => { await api.put('/pricing/' + id, body); setNotice('Rule updated'); await loadAll(); };
  const deleteRule = async (id) => { if (confirm('Delete rule?')) { await api.delete('/pricing/' + id); setNotice('Rule deleted'); await loadAll(); } };

  // validators (simple)
  const courtValidators = {
    name: v => !v ? 'Name is required' : '',
    type: v => (v !== 'indoor' && v !== 'outdoor') ? 'Type must be indoor or outdoor' : '',
    basePrice: v => (v === '' || v == null || Number.isNaN(v)) ? 'Base price required' : (v < 0 ? 'Must be >= 0' : '')
  };
  const coachValidators = {
    name: v => !v ? 'Name required' : '',
    hourlyRate: v => (v === '' || v == null || Number.isNaN(v)) ? 'Hourly rate required' : (v < 0 ? 'Must be >= 0' : '')
  };
  const equipValidators = {
    name: v => !v ? 'Name required' : '',
    totalStock: v => (v === '' || v == null || Number.isNaN(v)) ? 'Total stock required' : (v < 0 ? '>=0' : ''),
    pricePerUnit: v => (v === '' || v == null || Number.isNaN(v)) ? 'Price required' : (v < 0 ? '>=0' : '')
  };
  const ruleValidators = {
    name: v => !v ? 'Name required' : '',
    type: v => !v ? 'Type required' : '',
    multiplier: v => v !== '' && v != null && (Number.isNaN(v) || v <= 0) ? 'Must be number > 0' : ''
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      {notice && <div className="adm-notice">{notice}</div>}
      <ResourceEditor title="Courts"
                      items={courts}
                      onCreate={createCourt}
                      onUpdate={updateCourt}
                      onDelete={deleteCourt}
                      fields={['name','type','basePrice']}
                      validators={courtValidators} />

      <ResourceEditor title="Coaches"
                      items={coaches}
                      onCreate={createCoach}
                      onUpdate={updateCoach}
                      onDelete={deleteCoach}
                      fields={['name','hourlyRate']}
                      validators={coachValidators} />

      <ResourceEditor title="Equipment"
                      items={equipment}
                      onCreate={createEquip}
                      onUpdate={updateEquip}
                      onDelete={deleteEquip}
                      fields={['name','type','totalStock','pricePerUnit']}
                      validators={equipValidators} />

      <ResourceEditor title="Pricing Rules"
                      items={rules}
                      onCreate={createRule}
                      onUpdate={updateRule}
                      onDelete={deleteRule}
                      fields={['name','type','startHour','endHour','multiplier','surcharge','enabled']}
                      validators={ruleValidators} />
    </div>
  );
}
