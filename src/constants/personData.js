export default {
    data:[
        {
            title:"Datos personales",
            index:"Person",
            params:[
                {
                    name:"Nombre",
                    index:[
                        "name",
                        "surname",
                        "lastname"
                    ],
                    concat:" " 
                },
                {
                    name:"Fecha de nacimiento",
                    index:"birthday"
                },
                {
                    name:"CURP",
                    index:"curp"
                },
                {
                    name:"RFC",
                    index:"rfc"
                }
            ]
        },
        {
            title:"Datos de contacto",
            index:"Contact",
            params:[               
                {
                    name:"Telefono",
                    index:"phone"
                },
                {
                    name:"Correo electronico",
                    index:"email"
                },
                {
                    name:"Telefono de oficina",
                    index:"officePhone"
                }
            ]
        },
        {
            title:"Dirección",
            index:"Address",
            params:[               
                {
                    name:"Calle",
                    index:"street"
                },
                {
                    name:"Número",
                    index:"number"
                },
                {
                    name:"Codigo postal",
                    index:"zip_code"
                },
                {
                    name:"Alcaldia/Municipio",
                    index:"township"
                },
                {
                    name:"Estado",
                    index:"city"
                }
            ]
        },
        {
            title:"Datos medicos",
            index:"Medical",
            params:[               
                {
                    name:"Tipo de sangre",
                    index:"blood_type"
                },
                {
                    name:"Alergias",
                    index:"allergies"
                },
                {
                    name:"Medicamentos",
                    index:"medicine"
                },
                {
                    name:"Enfermedades",
                    index:"disaeses"
                },
                {
                    name:"Altura(mts)",
                    index:"height"
                },
                {
                    name:"Peso(kg)",
                    index:"weight"
                },                
                {
                    name:"Genero",
                    index:"gender"
                },
                {
                    name:"Señas particulares",
                    index:"particulars"
                },
                {
                    name:"Seguro",
                    index:"insurance"
                },
                {
                    name:"Numero de seguridad social",
                    index:"ssn"
                }
            ]
        }
    ]
}