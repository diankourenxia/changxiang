/**
 * 事件发布订阅模式
 */

function Event() {
  this.$event = {} // 事件挂载对象
  this.eventIdx = 0 // 事件监听器的数量，不使用随机数唯一表示监听器了，数字简便
}

/**
 * 订阅注册事件
 * @param {String} eventName : 事件名。注：除非是同一个目的，否则eventName千万不要同名
 * @param {Function} cb : 事件发生时的回调方法
 */
Event.prototype.subscribe = function(eventName, cb) {
  const handlerList = this.$event[eventName] || [] // 获取到已注册的事件
  this.eventIdx++
  const obj = {
    cb,
    id: this.eventIdx
  }
  handlerList.push(obj)
  this.$event[eventName] = handlerList

  return this.eventIdx // 返回eventIdx便于后续注销该监听器
}

/**
 * 发射事件
 * @param {String} eventName : 事件名
 */
Event.prototype.emit = function(eventName) {
  const handlerList = this.$event[eventName]

  if (!checkArrValid(handlerList)) return

  handlerList.forEach(cbObj => {
    const cb = cbObj && cbObj.cb
    cb && cb()
  })
}

/**
 * 卸载监听器
 * @param {String} eventName : 事件名
 * @param {Number} id : 事件监听器的ID
 */
Event.prototype.removeHandler = function(eventName, id) {
  const handlerList = this.$event[eventName]

  if (!checkArrValid(handlerList)) return

  const newHandlerList = handlerList.filter(obj => obj.id != id)
  this.$event[eventName] = newHandlerList
}

// 判断数组是有效的
function checkArrValid(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]" && arr.length
}

const eventBus = new Event()

export {
  eventBus,
}