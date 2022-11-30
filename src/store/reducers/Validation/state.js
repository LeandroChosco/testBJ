
export  const todo = (state = {}, action) => {
    switch (action.type) {
      case 'IS_VALIDATE':
        return {
          isLPR: action.isLPR,
          completed: false
        }
      default:
        return state
    }
  }
  
 