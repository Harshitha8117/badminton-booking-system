import React from 'react';
export default function ResourceSelector({equipment, onChange}) {
  return (
    <div>
      <label>Rackets: <input type='number' min='0' value={equipment.rackets||0} onChange={e=>onChange({...equipment, rackets: Number(e.target.value)})} /></label>
      <br/>
      <label>Shoes: <input type='number' min='0' value={equipment.shoes||0} onChange={e=>onChange({...equipment, shoes: Number(e.target.value)})} /></label>
    </div>
  );
}
