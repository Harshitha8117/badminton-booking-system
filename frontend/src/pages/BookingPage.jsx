// frontend/src/pages/BookingPage.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import '../styles/app.css';
import { jsPDF } from 'jspdf';

function createPdfReceipt(booking) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 40;
  let y = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Badminton Booking Receipt', margin, y);
  y += 26;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt ID: ${booking._id || Date.now()}`, margin, y);
  y += 16;
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
  y += 20;

  doc.setDrawColor(220);
  doc.setLineWidth(0.5);
  doc.line(margin, y, 560, y);
  y += 16;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Details', margin, y);
  y += 16;
  doc.setFont('helvetica', 'normal');

  const start = booking.startTime ? new Date(booking.startTime) : null;
  const end = booking.endTime ? new Date(booking.endTime) : null;

  doc.text(`Name: ${booking.userName || 'Guest'}`, margin, y); y += 14;
  doc.text(`Court: ${booking.courtId?.name || '—'}`, margin, y); y += 14;
  doc.text(`Time: ${start ? start.toLocaleString() : '—'} — ${end ? end.toLocaleString() : '—'}`, margin, y); y += 14;
  doc.text(`Coach: ${booking.coachId?.name || 'None'}`, margin, y); y += 14;

  const rackets = booking.equipment?.rackets ?? 0;
  const shoes = booking.equipment?.shoes ?? 0;
  doc.text(`Rackets: ${rackets}`, margin, y); y += 14;
  doc.text(`Shoes: ${shoes}`, margin, y); y += 18;

  doc.setFont('helvetica', 'bold');
  doc.text('Price', margin, y);
  y += 16;
  doc.setFont('helvetica', 'normal');

  const base = booking.pricingBreakdown?.basePrice ?? 0;
  const total = booking.pricingBreakdown?.total ?? 0;

  doc.text(`Base: $${Number(base).toFixed(2)}`, margin, y); y += 14;
  doc.text(`Rackets (${rackets} × $5): $${(rackets * 5).toFixed(2)}`, margin, y); y += 14;
  doc.text(`Shoes (${shoes} × $3): $${(shoes * 3).toFixed(2)}`, margin, y); y += 14;
  if (booking.coachId?.hourlyRate) {
    doc.text(`Coach: $${Number(booking.coachId.hourlyRate).toFixed(2)}`, margin, y);
    y += 14;
  }
  doc.text(`Total: $${Number(total).toFixed(2)}`, margin, y); y += 20;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Thank you for booking. Please bring this receipt on arrival.', margin, y);

  const fileName = `booking-receipt-${booking._id || Date.now()}.pdf`;
  doc.save(fileName);
}

export default function BookingPage() {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [equipment, setEquipment] = useState({ rackets: 0, shoes: 0 });
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState('');
  const [pricing, setPricing] = useState(null);
  const [name, setName] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    api.get('/courts').then(r => setCourts(r.data || [])).catch(() => setCourts([]));
    api.get('/coaches').then(r => setCoaches(r.data || [])).catch(() => setCoaches([]));
    const s = [];
    for (let h = 9; h < 21; h++) s.push(h + ':00');
    setSlots(s);
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!selectedCourt || !date || !selectedSlot) return setPricing(null);
      try {
        const court = courts.find(c => c._id === selectedCourt);
        const res = await api.get('/pricing');
        const rules = res.data || [];
        let price = (court?.basePrice) || 0;
        const dt = new Date(date + ' ' + selectedSlot);
        const hour = dt.getHours();
        const day = dt.getDay();
        rules.forEach(rule => {
          if (!rule.enabled) return;
          if (rule.type === 'weekend' && (day === 0 || day === 6)) price += rule.surcharge || 0;
          if (rule.type === 'peak' && rule.startHour != null && rule.endHour != null && hour >= rule.startHour && hour < rule.endHour) price = price * (rule.multiplier || 1);
          if (rule.type === 'indoorPremium' && court?.type === 'indoor') price += rule.surcharge || 0;
        });
        price += (equipment.rackets || 0) * 5 + (equipment.shoes || 0) * 3;
        if (selectedCoach) { const c = coaches.find(x => x._id === selectedCoach); price += c?.hourlyRate || 0; }
        setPricing({ basePrice: court?.basePrice || 0, total: Math.round(price * 100) / 100 });
      } catch (e) {
        console.error(e);
      }
    };
    fetchPrice();
  }, [selectedCourt, date, selectedSlot, equipment, selectedCoach, courts, coaches]);

  const book = async () => {
    setNotice('');
    if (!selectedCourt || !date || !selectedSlot) { setNotice('Select court, date and slot'); return; }
    const start = new Date(date + ' ' + selectedSlot);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    try {
      const res = await api.post('/bookings', {
        userName: name || 'Guest',
        courtId: selectedCourt,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        equipment,
        coachId: selectedCoach || null
      });

      // backend now returns populated booking at res.data.booking
      const booking = res?.data?.booking;
      if (!booking) {
        setNotice('Booked successfully, but server returned no booking data.');
      } else {
        setNotice('Booked! Total: ' + (booking.pricingBreakdown?.total ?? '0'));

        // download receipt (uses populated fields: booking.courtId, booking.coachId)
        try { createPdfReceipt(booking); } catch (pdfErr) { console.error('PDF error', pdfErr); }
      }

      // clear selections
      setSelectedSlot('');
      setEquipment({ rackets: 0, shoes: 0 });
      setSelectedCoach('');
    } catch (err) {
      setNotice('Booking failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Booking</h1>
      <div className="booking-layout">
        <div className="card">
          <div className="field"><label>Name</label><input value={name} onChange={e => setName(e.target.value)} /></div>

          <div className="field">
            <label>Choose court</label>
            <select value={selectedCourt} onChange={e => setSelectedCourt(e.target.value)} className="inp">
              <option value="">--select--</option>
              {courts.map(c => <option key={c._id} value={c._id}>{c.name} ({c.type}) - ${c.basePrice}</option>)}
            </select>
          </div>

          <div className="field"><label>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>

          <div style={{ marginTop: 8 }}>
            <label style={{ fontWeight: 700 }}>Slots</label>
            <div className="slot-grid" style={{ marginTop: 8 }}>
              {slots.map(s => (
                <div key={s} className={'slot' + (selectedSlot === s ? ' selected' : '')} onClick={() => setSelectedSlot(s)}>{s}</div>
              ))}
            </div>
            <div className="hint" style={{ marginTop: 8 }}>Selected: <strong>{selectedSlot || '—'}</strong></div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontWeight: 700 }}>Coach</label>
            <select value={selectedCoach} onChange={e => setSelectedCoach(e.target.value)} className="inp">
              <option value="">--none--</option>
              {coaches.map(c => <option key={c._id} value={c._id}>{c.name} - ${c.hourlyRate}/hr</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
            <div>
              <label>Rackets</label>
              <input type="number" min="0" value={equipment.rackets} onChange={e => setEquipment({ ...equipment, rackets: Number(e.target.value) })} />
            </div>
            <div>
              <label>Shoes</label>
              <input type="number" min="0" value={equipment.shoes} onChange={e => setEquipment({ ...equipment, shoes: Number(e.target.value) })} />
            </div>
          </div>

          <div className="price-box">
            <h3>Price</h3>
            <div className="price-row"><div>Base:</div><div>${(pricing?.basePrice || 0).toFixed(2)}</div></div>
            <div className="price-row" style={{ marginTop: 6 }}><div>Total:</div><div className="price-total">${(pricing?.total || 0).toFixed(2)}</div></div>
          </div>

          <div style={{ marginTop: 14 }}>
            <button className="btn" onClick={book}>Confirm Booking</button>
            {notice && <div style={{ marginTop: 10 }} className="hint">{notice}</div>}
          </div>
        </div>

        <aside className="side-card">
          <div className="card">
            <div className="section-title">Quick info</div>
            <div className="hint">Pick a date & slot. Price updates live based on your selections and admin rules.</div>
            <div style={{ height: 12 }} />
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Price preview</div>
            <div style={{ fontSize: 13, color: '#374151' }}>Base and total shown live. Add equipment or coach to include fees.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
