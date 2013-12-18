# message

All in one 前端通信框架.

### 支持通信类型

- **module** 页内各模块通信
- **iframe** 宿主到iframe 或 iframe 之间通信
- **open** 打开新页面(窗口)到原页面之间通信
- **page** 同域下多页面之间的通信

### 使用方支持

- 产品线内部
- 第三方合作方

### 场景

1. iframe 与宿主双向通信, 如第三方合作, 首页引入二级页资源

2. 跨页通信, 如新窗口打开账号登录

3. 页内模块间通信

4. 用户可能已经打开了首页和几个二级页, 当二级页换肤后, 打开的页面都同时换肤

### 浏览器兼容:

- IE6-11
- Chrome / Opera
- Firefox

### TODO

- more test.

## Usage

### Get Start

**SETUP1 申请频道**

命名规范: `通信类型.唯一标示名.功能名`

例如: `iframe.yahoo-music.control`

注意:

- 全部小写, 以 "-" 连接单词
- 以 `.` 连接命名级别

**SETUP2 引入方式**

- 给第三方提供一个可以访问的 `message.js` 地址

```html
<script src="http://br.hao123.com/.../message.js"></script>
```

- 产品线内部使用

```javascript
var message = require(".../message");
```

**SETUP3 Simple**

- 以实例方式使用

```javascript
// 创建频道实例
var msg = Hao123.message("iframe.yahoo.music-control");

// 监听消息
msg.on(function(data) {
});

// 停止监听
msg.off()

// 发送给对方消息
msg.send(data);
```

- 直接使用

```javascript
// 监听
Hao123.message.on("iframe.yahoo.music-control", function(data) {
})

// 取消监听
Hao123.message.off("iframe.yahoo.music-control")

// 发送消息
Hao123.message.send("iframe.yahoo.music-control", data)
```


### API

- `on` 

- `send`

- `off`

### 通信类型及支持程度

|Type| Allow Cross-domian| Two-way | Support Data-type | Description|
|----|----|----|----|----|
|module|× |√ | Any |页内各模块通信|
|iframe|√ |√ | `String` |宿主到iframe 或 iframe 之间通信|
|open|√|× | Any |打开新窗口到原页面的单向通信|
|page| √| × (较新的 webkit 可以由 globalStorage 实现跨域)| `String` | 同域下多页面之间的通信|

### More Case

- module <-> module

```javascript
// send to mod1
message.send("module.mod1.test", this.getElementsByTagName("input")[0].value);
```

- iframe -> host

```javascript
// send to parent
message.send("iframe.mod4.test", this.getElementsByTagName("input")[0].value);
```

- host -> iframe

```javascript
// send to mod4
message.send("iframe.mod3.test", this.getElementsByTagName("input")[0].value, document.getElementById("mod4").contentWindow);
    return false;
```

- iframe <-> iframe

```javascript
// 方式1, iframe 相互已知, 指定对象句柄
message
        .send("iframe.mod6.test", this.getElementsByTagName("input")[0].value, window.parent.frames[1])
        .send("iframe.mod6.test", this.getElementsByTagName("input")[0].value, window.parent.frames[3]);

// 方式2, iframe 之间不透明, 通过 parent 代理
// iframe
message.send("iframe.mod7.test", this.getElementsByTagName("input")[0].value);

// host proxy
message.on("iframe.mod7.test", function(data) {

    // only send to mod6
    message.send("iframe.mod7.test", data, document.getElementById("mod6").contentWindow);

    // send to all iframes
    for(var iframes = window.frames, i = 0, ifr; ifr = iframes[i++];)
    message.send("iframe.mod7.test", data, ifr);
});
```