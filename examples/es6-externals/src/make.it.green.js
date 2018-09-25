import $ from 'jquery';

export function makeItGreen() {
    const style = $('style')[0];
    style.type = 'text/css';
    const css = 'html,body{background-color:green};';

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    $('head').append(style);
}
