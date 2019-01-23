export function makeItGreen() {
    const style = document.createElement('style');
    style.type = 'text/css';
    const css = 'html,body{background-color:green};';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.head.appendChild(style);
}
