const removeSpaces = (string) => {
    if(string){
        return string = string.trim().toLowerCase();
    } else {
        return true;
    }
};

export { removeSpaces };