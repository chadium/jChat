function appendCSS(type, name) {
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        class: `chat_${type}`,
        href: `styles/${type}_${name}.css`
    }).appendTo("head");
}

function escapeRegExp(string) { // Thanks to coolaj86 and Darren Cook (https://stackoverflow.com/a/6969486)
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(message) {
    return message
        .replace(/&/g, "&amp;")
        .replace(/(<)(?!3)/g, "&lt;")
        .replace(/(>)(?!\()/g, "&gt;");
}

function GetJson(url, {
    timeout = 10000
} = {}) {
    let error = new Error("Response error")
    error.name = 'ResponseError'

    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            timeout
        })
            .done((data) => {
                resolve(data)
            })
            .fail((response) => {
                error.message = response.statusMessage
                error.response = response
                reject(error)
            })
    })
}

function TwitchAPI(url) {
    return GetJson(url, {
        timeout: 5000
    })
}