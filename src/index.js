;(function () {
  function Modal(options) {
    return new init(options)
  }

  Modal.prototype = {
    constructor: Modal,
    init() {
      this.createDOM()
      this.addClick()
      this.drag()
      this._scrollbarWidth = this._getScrollbarWidth()
    },

    createDOM() {
      let { title, template, buttons } = this.options
      let frag = document.createDocumentFragment(),
        modal = document.createElement('div')

      modal.className = 'shade hidden'
      modal.innerHTML = `
        <div class="modal-wrapper">
          <div class="modal-header">
            <div class="modal-title">${title}</div>
            <div class="modal-cancel">×</div>
          </div>
          <div class="modal-body">${template}</div>
          ${
            buttons.length
              ? `<div class="modal-footer"}>
              ${buttons
                .map((v, i) => {
                  return `<button index="${i}">${v.text}</button>`
                })
                .join('')}
                  </div>`
              : ''
          }
        </div>
      `

      frag.appendChild(modal)

      document.body.appendChild(frag)
      frag = null

      this.element = modal
    },

    addClick() {
      this.element.children[0].addEventListener('click', (e) => {
        const target = e.target

        if (target.className === 'modal-cancel') {
          this.close()
          return
        }

        if (target.tagName === 'BUTTON') {
          const index = target.getAttribute('index')
          const func = this.options.buttons[index].click

          typeof func === 'function' && func.call(this)
          return
        }
      })
    },

    drag() {
      const dragTarget = this.element.children[0]

      dragTarget.children[0].onmousedown = (e) => {
        dragTarget.style.position = 'absolute'
        dragTarget.style.zIndex = '1000'

        let offsetX = e.offsetX
        let offsetY = e.offsetY

        function move(e) {
          let x = e.clientX - offsetX
          let y = e.clientY - offsetY

          dragTarget.style.left = x + 'px'
          dragTarget.style.top = y + 'px'
        }

        document.addEventListener('mousemove', move)

        document.onmouseup = () => {
          document.removeEventListener('mousemove', move)
          dragTarget.onmouseup = null
        }
      }
    },

    open() {
      this.emit('open')

      this.element.className = 'shade'

      if (this._hasScrollbar()) {
        document.body.style.paddingRight = this._scrollbarWidth + 'px'
      }

      document.body.style.overflow = 'hidden'
    },

    close() {
      this.element.className = 'shade hidden'
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''

      this.element.children[0].removeAttribute('style')

      this.emit('close')
    },

    on(eventName, func) {
      this.pond[eventName].push(func)
    },

    emit(eventName) {
      this.pond[eventName].forEach((i) => {
        typeof i === 'function' && i.call(this)
      })
    },

    _getScrollbarWidth() {
      const scrollDiv = document.createElement('div')
      scrollDiv.className = 'modal-scrollbar-measure'
      document.body.appendChild(scrollDiv)
      const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
      document.body.removeChild(scrollDiv)
      return scrollbarWidth
    },

    _hasScrollbar() {
      const rect = document.body.getBoundingClientRect()
      return rect.left + rect.right < window.innerWidth
    }
  }

  function init(options = {}) {
    options = Object.assign(
      {
        title: '提示',
        template: '',
        buttons: []
      },
      options
    )

    this.options = options

    this.pond = {
      open: [],
      close: []
    }

    this.init()
  }

  init.prototype = Modal.prototype

  window.Modal = Modal

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Modal
  }
})()
