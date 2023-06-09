import Poncon from 'ponconjs'
import * as md5 from 'md5'
import { encode } from 'querystring'

const DATA = {
    /** 是否联网校验过 */
    hasVerLogin: false,
    /** 是否登录 */
    hasLogin: false
}
verLogin()
router()
setResizeDiv()
addClickEvent()
document.ondragstart = () => false


function getLoginRes(loginName?: string, passwordMd5?: string) {
    const xhr = new XMLHttpRequest()
    // 判断是否为登录界面手动登录
    if (loginName && passwordMd5) {
        xhr.open('POST', '/login', false)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(encode({
            loginName: loginName,
            password: passwordMd5
        }))
    } else {
        xhr.open('GET', '/login', false)
        xhr.send()
    }
    const resData = JSON.parse(xhr.responseText)
    return resData
}
/** 判断登录状态 */
function verLogin() {
    const target = location.hash.split('/')[1]
    if (target == 'login' && DATA.hasLogin) return location.hash = ''
    if (!DATA.hasVerLogin) {
        const resData = getLoginRes()
        let code = resData.code
        if (code == 200) {
            DATA.hasLogin = true
            if (target == 'login') location.hash = ''
        } else location.hash = '#/login'
        DATA.hasVerLogin = true
    } else {
        if (!DATA.hasLogin) location.hash = '#/login'
    }
}

/** 配置路由 */
function router() {
    const poncon = new Poncon()
    poncon.setPageList(['home', 'friend', 'about', 'login', 'user'])
    // 主页
    poncon.setPage('home', () => {

    })
    // 通讯录
    poncon.setPage('friend', () => {

    })
    // 关于
    poncon.setPage('about', () => {

    })
    // 个人信息
    poncon.setPage('login', () => {

    })
    // 登录注册
    poncon.setPage('login', () => {

    })

    window.addEventListener('hashchange', verLogin)
    poncon.start()
    autoMenuStats(poncon)
}

/** 自动切换导航菜单显示状态 */
function autoMenuStats(poncon: Poncon) {
    changeMenuStats(poncon)
    window.addEventListener('hashchange', (event) => {
        changeMenuStats(poncon)
    })
}

/**
 * 切换导航菜单状态
 * @param target 页面标识
 */
function changeMenuStats(poncon: Poncon) {
    let activeTarget = poncon.getTarget()
    const menuTabItemEles = document.querySelectorAll<HTMLImageElement>('.menu-tab-list .menu-item')
    const icons: Record<string, string[]> = {
        home: ['./img/chat-fill.svg', './img/chat.svg'],
        friend: ['./img/person-vcard-fill.svg', './img/person-vcard.svg'],
        about: ['./img/info-circle-fill.svg', './img/info-circle.svg'],
        user: ['./img/person-fill.svg', './img/person.svg'],
    }
    menuTabItemEles.forEach(menuTabItemEles => {
        let target = menuTabItemEles.getAttribute('data-target') as string
        const icon = icons[target]
        const imgEle = menuTabItemEles.querySelector('img') as HTMLImageElement
        imgEle.src = target == activeTarget ? icon[0] : icon[1]
    })
}

/** 拖拽聊天输入框上边框，实现高度调整 */
function setResizeDiv() {
    const ele = document.querySelector('.chat-input-box .change-position') as HTMLDivElement
    const inputBoxEle = document.querySelector('.chat-input-box') as HTMLDivElement
    let isSelected = false
    let startHeight = 0
    let startY = 0
    ele?.addEventListener('mousedown', (event) => {
        isSelected = true
        startHeight = inputBoxEle.offsetHeight
        startY = event.pageY
        document.body.style.cursor = 'ns-resize'
    })
    document.body.addEventListener('mouseup', (event) => {
        isSelected = false
        document.body.style.cursor = ''
    })
    document.body.addEventListener('mousemove', (event) => {
        if (!isSelected) return
        const changeHeight = event.pageY - startY
        let height = startHeight - changeHeight
        if (height > 400) return
        if (height < 150) return
        inputBoxEle.style.height = height + 'px'
    })
}

/** 为初始载入的元素添加单击事件 */
function addClickEvent() {
    changeLoginRegister()
    setLogoutEvent()
    setLoginEvent()
    setRegisterEvent()
    /** 设置登录事件 */
    function setLoginEvent() {
        const loginPageEle = document.querySelector('.poncon-login') as HTMLDivElement
        const loginBtn = loginPageEle.querySelector('.login-btn') as HTMLDivElement
        const loginNameEleOfLogin = loginPageEle.querySelector('.input-username') as HTMLInputElement
        const passwordEleOfLogin = loginPageEle.querySelector('.input-password') as HTMLInputElement
        // 回车聚焦到密码输入框
        loginNameEleOfLogin.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') passwordEleOfLogin.focus()
        })
        // 回车点击登录
        passwordEleOfLogin.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') loginBtn.click()
        })
        loginBtn.addEventListener('click', () => {
            let loginName = loginNameEleOfLogin.value
            let password = passwordEleOfLogin.value
            if (!loginName.match(/^\w{4,20}$/)) return alert('用户名长度为4-20个字符')
            if (!password.match(/^\w{4,20}$/)) return alert('密码长度为4-20个字符')
            let passwordMd5 = md5(password)
            const resData = getLoginRes(loginName, passwordMd5)
            let code = resData.code
            if (code == 200) {
                location.hash = ''
                DATA.hasVerLogin = true
                DATA.hasLogin = true
                return
            }
            alert(resData.msg)
        })
    }
    /** 设置注册事件 */
    function setRegisterEvent() {
        const loginPageEle = document.querySelector('.poncon-login') as HTMLDivElement
        const registerSubPageEle = loginPageEle.querySelector('.box.register') as HTMLDivElement
        const registerBtn = registerSubPageEle.querySelector('.register-btn') as HTMLDivElement
        const nickNameEleOfRegister = registerSubPageEle.querySelector('.input-nickname') as HTMLInputElement
        const userNameEleOfRegister = registerSubPageEle.querySelector('.input-username') as HTMLInputElement
        const emailEleOfRegister = registerSubPageEle.querySelector('.input-email') as HTMLInputElement
        const passwordEleOfRegister = registerSubPageEle.querySelector('.input-password') as HTMLInputElement
        const password2EleOfRegister = registerSubPageEle.querySelector('.input-password2') as HTMLInputElement
        nickNameEleOfRegister.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') userNameEleOfRegister.focus()
        })
        userNameEleOfRegister.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') emailEleOfRegister.focus()
        })
        emailEleOfRegister.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') passwordEleOfRegister.focus()
        })
        passwordEleOfRegister.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') password2EleOfRegister.focus()
        })
        // 回车点击登录
        password2EleOfRegister.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') registerBtn.click()
        })
        registerBtn.addEventListener('click', () => {
            let userName = userNameEleOfRegister.value
            let password = passwordEleOfRegister.value
            let password2 = password2EleOfRegister.value
            let nickName = nickNameEleOfRegister.value
            let email = emailEleOfRegister.value
            if (password != password2) return alert('两次输入的不一致')
            if (!userName.match(/^\w{4,20}$/)) return alert('用户名长度为4-20个字符')
            if (!password.match(/^\w{4,20}$/)) return alert('密码长度为4-20个字符')
            let passwordMd5 = md5(password)
            const xhr = new XMLHttpRequest()
            xhr.open('POST', '/register', false)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            xhr.send(encode({ userName, password: passwordMd5, nickName, email }))
            const resData = JSON.parse(xhr.responseText)
            let code = resData.code
            if (code == 200) {
                location.hash = ''
                DATA.hasVerLogin = true
                DATA.hasLogin = true
                return
            }
            alert(resData.msg)
        })
    }
    /** 设置退出登录 */
    function setLogoutEvent() {
        const logoutBtn = document.querySelector('.poncon-user .logout') as HTMLDivElement
        const logoutBtn2 = document.querySelector('.menu-bottom-list .logout') as HTMLDivElement
        const clickEvent = () => {
            if (!confirm('确定要退出登录吗？')) return
            const xhr = new XMLHttpRequest()
            xhr.open('GET', '/logout', false)
            xhr.send()
            location.reload()
        }
        logoutBtn.addEventListener('click', clickEvent)
        logoutBtn2.addEventListener('click', clickEvent)
    }

    /** 切换登录和注册页面显示 */
    function changeLoginRegister() {
        /** 提示：已有账号？点击登录 */
        const loginMsg = document.querySelector('.poncon-login .login-msg') as HTMLDivElement
        /** 提示：没有账号？点击注册 */
        const registerMsg = document.querySelector('.poncon-login .register-msg') as HTMLDivElement
        /** 登录盒子 */
        const loginBoxEle = document.querySelector('.poncon-login .box.login') as HTMLDivElement
        /** 注册盒子 */
        const registerBoxEle = document.querySelector('.poncon-login .box.register') as HTMLDivElement
        loginMsg.addEventListener('click', () => {
            loginBoxEle.style.display = 'block'
            registerBoxEle.style.display = 'none'
        })
        registerMsg.addEventListener('click', () => {
            loginBoxEle.style.display = 'none'
            registerBoxEle.style.display = 'block'
        })
    }
}