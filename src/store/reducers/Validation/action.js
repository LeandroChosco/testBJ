export const setValidation = (isLPR) =>{
    return{
        type:"IS_VALIDATE",
        isLPR:isLPR
    }
}

export const defaultValidation = ()=>{
    return{
        type:"DEFAULT_IS_VALIDATE",
        isLPR: false
    }
}