import React from 'react';
import neutralEmoji from '../../assets/images/emojis/neutral.png'
import sadEmoji from '../../assets/images/emojis/triste.png'
import happyEmoji from '../../assets/images/emojis/feliz.png'
import angryEmoji from '../../assets/images/emojis/enojado.png'
import surpriseEmoji from '../../assets/images/emojis/sorprendido.png'

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
            <li key={index}>
              <img alt={item.mood} src={MOODS_EMOJIS[item.mood]} width='20%'></img>
              <h4>{item.mood}</h4>
              {item.total}
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