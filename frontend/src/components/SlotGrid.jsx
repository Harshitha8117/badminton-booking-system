import React from 'react';
export default function SlotGrid({slots, onSelect}) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8}}>
      {slots.map(s=> <button key={s} onClick={()=>onSelect(s)} style={{padding:10}}>{s}</button>)}
    </div>
  );
}
