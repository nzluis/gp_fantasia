const getHost = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('api')) {
        return 'https://fantasygpback.onrender.com';
    } else {
        return 'https://xnqz3kpy44.execute-api.eu-west-3.amazonaws.com/v1';
    }
};
export default getHost;
