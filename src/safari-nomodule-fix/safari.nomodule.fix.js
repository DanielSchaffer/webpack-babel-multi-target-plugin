/* eslint-env browser */
/**
 * nomodule fix for Safari 10.1
 * from https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc
 */
(function() {
  const check = document.createElement('script')
  if ('onbeforeload' in check) {
    let support = false
    document.addEventListener('beforeload', function(e) {
      if (e.target === check) {
        support = true
      } else if (!e.target.hasAttribute('nomodule') || !support) {
        return
      }
      e.preventDefault()
    }, true)

    check.type = 'module'
    check.src = '.'
    document.head.appendChild(check)
    check.remove()
  }
}())
