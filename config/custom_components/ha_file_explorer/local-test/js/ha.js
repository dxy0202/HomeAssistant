class HA {
    constructor() {
        // url参数
        let query = new URLSearchParams(location.search)
        this.query = (key) => {
            let val = query.get(key)
            if (val) {
                return decodeURIComponent(val)
            }
            return val
        }
        this.ver = this.query('ver')
    }

    fullscreen() {
        try {
            let haPanelIframe = top.document.body
                .querySelector("home-assistant")
                .shadowRoot.querySelector("home-assistant-main")
                .shadowRoot.querySelector("app-drawer-layout partial-panel-resolver ha-panel-iframe").shadowRoot
            let ha_card = haPanelIframe.querySelector("iframe");
            ha_card.style.position = 'absolute'
            haPanelIframe.querySelector('app-toolbar').style.display = 'none'
            ha_card.style.top = '0'
            ha_card.style.height = '100%'
        } catch{

        }
    }

    // 触发事件
    fire(type, data, ele = null) {
        console.log(type, data)
        const event = new top.Event(type, {
            bubbles: true,
            cancelable: false,
            composed: true
        });
        event.detail = data;
        if (!ele) {
            ele = top.document.querySelector("home-assistant")
                .shadowRoot.querySelector("home-assistant-main")
                .shadowRoot.querySelector("app-drawer-layout")
        }
        ele.dispatchEvent(event);
    }

    post(params) {
        return this.http(top.location.pathname + '-api-' + this.ver, params)
    }

    // http请求
    async http(url, params) {
        let hass = top.document.querySelector('home-assistant').hass
        let auth = hass.auth
        let authorization = ''
        if (auth._saveTokens) {
            // 过期
            if (auth.expired) {
                await auth.refreshAccessToken()
            }
            authorization = `${auth.data.token_type} ${auth.accessToken}`
        } else {
            authorization = `Bearer ${auth.data.access_token}`
        }
        let body = toString.call(params) == '[object FormData]' ? params : JSON.stringify(params)
        return fetch(url, {
            method: 'post',
            headers: {
                authorization
            },
            body
        }).then(res => res.json())
    }
}

window.ha = new HA();
(() => {
    // 主题跟着系统改变
    let style = document.createElement('style')
    style.textContent = `
    .teal{ background-color: ${top.getComputedStyle(top.document.body).getPropertyValue('--primary-color')} !important}
    `
    document.head.appendChild(style)
})();
// 百度统计
var _hmt = _hmt || []; window._hmt = _hmt; (function () { var hm = document.createElement('script'); hm.src = 'https://hm.baidu.com/hm.js?52d57d8b7588a022f89c451d06e311f0'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(hm, s) })();