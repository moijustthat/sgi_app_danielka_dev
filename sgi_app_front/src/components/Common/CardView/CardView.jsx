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
        value1,
        value2,
        value3,
        seeMore=true,
        btnText = 'Ver mas',
        onBtnClick=()=>null
    } = props

    return <div className="card_container">
                <div className="card_item">
                    <div className="card_inner">
                        <img src={img ? hexToDataURL(img) : a} alt="" />
                        <div className="userName">{name}</div>
                        <div className="userUrl">{description}</div>
                        <div className="detail-box">
                            <div className="gitDetail"><span>{detail1}</span>{value1}</div>
                            <div className="gitDetail"><span>{detail2}</span>{value2}</div>
                            <div className="gitDetail"><span>{detail3}</span>{value3}</div>
                        </div>
                        <button onClick={onBtnClick} style={{display: seeMore ? '' : 'none'}} className="seeMore">{btnText}</button>
                    </div>
                </div>
            </div>
}

export default CardView