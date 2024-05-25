import React from 'react';
import Lottie  from 'lottie-react';
import almacenVacio from './almacen-vacio.json'; 
import Shopping from './woman-shopping-online.json'
import Delivery from './online-delivery-service.json'
import Box from './box.json'

const map = {
  'almacenVacio': almacenVacio,
  'shopping': Shopping,
  'delivery': Delivery,
  'box': Box
}

const CardView = ({type, loop=true, text='', style}) => {
  return (
    <div
      style={style}
    >
      <Lottie animationData={map[type]} loop={loop} />
      <p style={{
        marginTop: '-12px',
        fontFamily: 'Inter',
        textAlign: 'center'
      }}>{text}</p>
    </div>
  );
};

export default CardView;
