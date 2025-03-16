const getHost = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('api')) {
        return 'https://xnqz3kpy44.execute-api.eu-west-3.amazonaws.com/v1';
    } else {
        return 'https://fantasygpback.onrender.com';
    }
    // return "http://localhost:5000";
    // return 'https://fantasygpback.onrender.com';
    // return 'https://xnqz3kpy44.execute-api.eu-west-3.amazonaws.com/v1';
};
export default getHost;
