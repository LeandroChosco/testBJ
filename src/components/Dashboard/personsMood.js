import React from 'react';
import neutralEmoji from '../../assets/images/emojis/neutral.png'
import sadEmoji from '../../assets/images/emojis/triste.png'
import happyEmoji from '../../assets/images/emojis/feliz.png'
import angryEmoji from '../../assets/images/emojis/enojado.png'
import surpriseEmoji from '../../assets/images/emojis/sorprendido.png'
// import { Icon } from "semantic-ui-react";
import { Col, Row } from 'reactstrap';

// import { fakeData } from './personsMoodFakeData';

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
                    {item.mood.toUpperCase()}
                  </p>
                </Col>
                <Col>
                  {/* {
                    item.total / previousData[index].total > 1 ?
                      <>
                        <Icon
                          name="sort up"
                          size="big"
                          className="text-success"
                        />
                        <p>
                          +{Math.floor(((item.total / previousData.find((el) => el.mood === item.mood).total) - 1) * 100)}%
                        </p>
                      </>
                      :
                      <>
                        <Icon
                          name="sort down"
                          size="big"
                          className="text-danger"
                        />
                        <p>
                          -{Math.floor((1 - (item.total / previousData.find((el) => el.mood === item.mood).total)) * 100)}%
                        </p>
                      </>
                  } */}
                </Col>
              </Row>
            </li>
          ))
          : null
      }
    </ul>
  )
}

export default PersonsMood;