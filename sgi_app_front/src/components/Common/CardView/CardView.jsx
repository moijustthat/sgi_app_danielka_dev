import React from 'react'
import a from '../../../imgs/logo.png'
import hexToDataURL from '../../../utils/HexToDataUrl'
import './CardView.css'

const CardView = (props) => {
    const {
        name,
        description,
        img,
        detail1,
        detail2,
        detail3,
        detail4,
        value1,
        value2,
        value3,
        value4,
        seeMore=true,
        btnText = 'Ver mas',
        onBtnClick=()=>null
    } = props

    return <div className="card_container">
                <div className="card_item">
                    <div className="card_inner">
                        <img src={img && img !== '' ? hexToDataURL(img) : a} alt="" />
                        <div className="userName">{name}</div>
                        <div className="detail-box">
                            <div className="gitDetail"><span>{detail1}</span>{value1}</div>
                        </div>
                        <button onClick={onBtnClick} style={{display: seeMore ? '' : 'none'}} className="seeMore">{btnText}</button>
                    </div>
                </div>
            </div>
}

export default CardView