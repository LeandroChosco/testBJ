export default {
    true:[
        {
            msg:"Sospechoso se encuentra en libertad condicional",
            type:'conditional'
        },
        {
            msg:"Sospechoso arrestado y puesto a disposición de las autoridades",
            type:'to_authorities'
        },
        {
            msg:"Arrestadó y solicitadó refuerzo federal",
            type:'federal_reinforcement'
        },
        {
            msg:"Arrestadó y solicitadó refuerzo estatal",
            type:'statal_reinforcement'
        }
    ],
    false:[
        {
            msg:"Match similar pero el sospechoso no era el",
            type:'similar'
        },
        {
            msg:"Match no era nada similar al sospechoso",
            type:'no_similar'
        },
        {
            msg:"Match con una mujer, el sospechoso es hombre",
            type:'female_on_male'
        },
        {
            msg:"Match con un hombre, sospechosa es mujer",
            type:'male_on_female'
        },
        {
            msg:"Match en objeto y no en persona",
            type:'object'
        }
    ]
}