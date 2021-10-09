// https://stackoverflow.com/questions/111529/how-to-create-query-parameters-in-javascript

function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}

function appendCSS(file){
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        class: "size",
        href: `styles/${file}.css`
    }).appendTo("head");
}

function fadeOption(event) {
    if ($fade_bool.is(':checked')) {
        $fade.removeClass('hidden');
        $fade_seconds.removeClass('hidden');
    } else {
        $fade.addClass('hidden');
        $fade_seconds.addClass('hidden');
    }
}

function sizeUpdate(event) {
    $('link[class="size"]').remove();

    appendCSS(`size_${sizes[Number($size.val()) -1]}`)
}

function fontUpdate(event) {
    $('link[class="font"]').remove();
    
    appendCSS(`font_${fonts[Number($font.val())]}`)
}

function strokeUpdate(event) {
    $('link[class="stroke"]').remove();

    if ($stroke.val() == "0") return // if "off is selected"

    appendCSS(`stroke_${strokes[Number($stroke.val()) - 1]}`)
}

function shadowUpdate(event) {
    $('link[class="shadow"]').remove();

    if ($shadow.val() == "0") return // if "off is selected"

    appendCSS(`shadow_${shadows[Number($shadow.val()) - 1]}`)

}

function capsUpdate(event) {
    if ($small_caps.is(':checked')) {
        appendCSS('variant_SmallCaps')
    } else {
        $('link[class="small_caps"]').remove();
    }
}

function badgesUpdate(event) {
    if ($badges.is(':checked')) {
        $('img[class="badge special"]').addClass('hidden');
    } else {
        $('img[class="badge special hidden"]').removeClass('hidden');
    }
}

function generateURL(event) {
    event.preventDefault();

    const generatedUrl = 'https://www.giambaj.it/twitch/jchat/v2/?channel=' + $channel.val();

    let data = {
        animate: $animate.is(':checked'),
        bots: $bots.is(':checked'),
        fade: $fade_bool.is(':checked'),
        hide_commands: $commands.is(':checked'),
        hide_badges: $badges.is(':checked'),
        size: $size.val(),
        font: $font.val(),
        small_caps: $small_caps.is(':checked')
    }

    if ($stroke.val() != '0') data.stroke = $stroke.val();
    if ($shadow.val() != '0') data.shadow = $shadow.val();

    const params = encodeQueryData(data)

    $url.val(generatedUrl + '?' + params);

    $generator.addClass('hidden');
    $result.removeClass('hidden');
}

function changePreview(event) {
    if ($example.hasClass("white")) {
        $example.removeClass("white");
        $brightness.attr('src', "img/light.png");
    } else {
        $example.addClass("white");
        $brightness.attr('src', "img/dark.png");
    }
}

function copyUrl(event) {
    navigator.clipboard.writeText($url.val());

    $alert.css('visibility', 'visible');
    $alert.css('opacity', '1');
}

function showUrl(event) {
    $alert.css('opacity', '0');
    setTimeout(function() {
        $alert.css('visibility', 'hidden');
    }, 200);
}

function resetForm(event) {
    $channel.val("");
    $animate.prop('checked', false);
    $bots.prop('checked', false);
    $fade_bool.prop('checked', false);
    $fade.addClass('hidden');
    $fade_seconds.addClass('hidden');
    $fade.val("30");
    $commands.prop('checked', false);
    $small_caps.prop('checked', false);
    $badges.prop('checked', false);
    $('link[class="small_caps"]').remove();
    $('img[class="badge special hidden"]').removeClass('hidden');
    $result.addClass('hidden');
    $generator.removeClass('hidden');
    showUrl();
}

const fonts = [ 'BalooTammudu', 'SegoeUI', 'Roboto', 'Lato', 'NotoSans', 'SourceCodePro',
'Impact', 'Comfortaa', 'DancingScript', 'IndieFlower', 'PressStart2P', 'Wallpoet']
const sizes = ['small', 'medium', 'large']
const strokes = ['thin', 'medium', 'thick', 'thicker']
const shadows = ['small', 'medium', 'large']

const $generator = $("form[name='generator']");
const $channel = $('input[name="channel"]');
const $animate = $('input[name="animate"]');
const $bots = $('input[name="bots"]');
const $fade_bool = $("input[name='fade_bool']");
const $fade = $("input[name='fade']");
const $fade_seconds = $("#fade_seconds");
const $commands = $("input[name='commands']");
const $small_caps = $("input[name='small_caps']");
const $badges = $("input[name='badges']");
const $size = $("select[name='size']");
const $font = $("select[name='font']");
const $stroke = $("select[name='stroke']");
const $shadow = $("select[name='shadow']");
const $brightness = $("#brightness");
const $example = $('#example');
const $result = $("#result");
const $url = $('#url');
const $alert = $("#alert");
const $reset = $("#reset");

$fade_bool.change(fadeOption);
$size.change(sizeUpdate);
$font.change(fontUpdate);
$stroke.change(strokeUpdate);
$shadow.change(shadowUpdate);
$small_caps.change(capsUpdate);
$badges.change(badgesUpdate);
$generator.submit(generateURL);
$brightness.click(changePreview);
$url.click(copyUrl);
$alert.click(showUrl);
$reset.click(resetForm);