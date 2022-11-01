import React from 'react';
import neutralEmoji from '../../assets/images/emojis/neutral.png'
import sadEmoji from '../../assets/images/emojis/triste.png'
import happyEmoji from '../../assets/images/emojis/feliz.png'
import angryEmoji from '../../assets/images/emojis/enojado.png'
import surpriseEmoji from '../../assets/images/emojis/sorprendido.png'
import { HiArrowCircleDown, HiArrowCircleUp } from 'react-icons/hi'
import { TiEquals } from 'react-icons/ti'
import { Col, Row } from 'reactstrap';

const MOODS_EMOJIS = {
  Neutral: neutralEmoji,
  Sorprendido: surpriseEmoji,
  Triste: sadEmoji,
  Feliz: happyEmoji,
  Enojado: angryEmoji
}

const PersonsMood = (props) => {
  const { personsMood } = props;
  return (
    <ul className="cardlist">
      {
        personsMood.length > 0 ?
          personsMood.map((item, index) => item.mood !== "" && (
            <li style={{ padding: "1.5rem", marginRight: "1rem" }} key={index}>
              <Row>
                <Col>
                  <img alt={item.mood} src={MOODS_EMOJIS[item.mood]} width='75%'></img>
                </Col>
                <Col>
                  <h1>
                    {item.total}
                  </h1>
                  <p>
                    {item.mood}
                  </p>
                </Col>
                <Col>
                  {
                    index === 0 || index === 3 ?
                      <>
                        <HiArrowCircleDown style={{ color: "red", border: "none", width: "40px", height: "40px" }} />
                        <p>
                          -10%
                        </p>
                      </>
                      :
                      index === 4 ?
                        <>
                          <HiArrowCircleUp style={{ color: "green", border: "none", width: "40px", height: "40px" }} />
                          <p>
                            +15%
                          </p>
                        </>
                        :
                        <>
                          <TiEquals style={{ color: "grey", border: "none", width: "40px", height: "40px" }} />
                          <p>
                            ±5%
                          </p>
                        </>
                  }
                </Col>
              </Row>
            </li>
          ))
          : null
      }
      {/* <li>
        <img alt="Neutral" src={neutralEmoji} width='20%'></img>
        <h4>Neutral</h4>
        {personsMood[0].total}
      </li>
      <li>
        <img alt="Sorprendido" src={surpriseEmoji} width='20%'></img>
        <h4>Sorprendido</h4>
        {personsMood[1].total}
      </li>
      <li>
        <img alt="Triste" src={sadEmoji} width='20%'></img>
        <h4>Triste</h4>
        {personsMood[2].total}
      </li>
      <li>
        <img alt="Feliz" src={happyEmoji} width='20%'></img>
        <h4>Feliz</h4>
        {personsMood[3].total}
      </li>
      <li>
        <img alt="Enojado" src={angryEmoji} width='20%'></img>
        <h4>Enojado</h4>
        {personsMood[4].total}
      </li> */}
    </ul>
  )
}

export default PersonsMood;