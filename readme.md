# Modal

一个原生 JavaScript 实现的 modal 组件。

![demo](/assets/demo.gif)

## 特性

- 高度可扩展性和定制性
- 可注册 modal 打开、关闭事件
- 背景锁定滚动
- 可拖拽

## 选项

示例代码：

```
const modal = Modal({
  title: 'Lorem',
  template:
    'Hello World!',
  buttons: [
    {
      text: '关闭',
      click() {
        this.close()
      }
    },
    {
      text: '确定',
      click() {
        console.log('confirm')
      }
    }
  ]
})
```

事件：

```
modal.on('open', () => {
    console.log('open')
})

modal.on('close', () => {
  console.log('close')
})
```

## 后记

此项目代码参考珠峰前端直播课程所教授内容。  
readme 内容按照 [中文文案排版指北](https://github.com/sparanoid/chinese-copywriting-guidelines) 进行排版。
