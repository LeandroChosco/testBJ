export const urlHttpOrHttps = (server, output_port, name, channel = false, protocol = false) => {
    let url = null;
    if (output_port === 80 || output_port === 443) {
        if (protocol) {
            url = `${protocol}://${server}${name}${channel}`;
        } else {
            url = `https://${server}${name}${channel}`;
        }
    } else {
        if (protocol) {
            url = `${protocol}://${server}:${output_port}${name}${channel}`;
        } else {
            url = `http://${server}:${output_port}${name}${channel}`;
        }
    }
    return url;
};


export const urlHttpOrHttpsMultimedia = (server, output_port, src, protocol = false) => {
    let url = null;
    if (output_port === 80 || output_port === 443) {
        url = `${protocol}://${server}/${src}`;
    } else {
        url = `${protocol}://${server}:${output_port}/${src}`;
    }
    return url;
};