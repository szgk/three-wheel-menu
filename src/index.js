import {rotToRad, getAngle} from './utils'

class WheelMenu {
  /**
   * wheel menu
   * @param {Three} _THREE Three.js
   * @param {THREE.Scene} scene THREE.Scene
   * @param {THREE.PerspectiveCamera} camera THREE.PerspectiveCamera
   * @param {HTMLCanvasElement} canvas 
   * @param {Oject}  options optional params 
   * @param {Item[]}  options.items optional params 
   * @param {string}  Item.name text as menu item
   * @param {number}  Item.width item width
   * @param {number}  Item.height item height
   * @param {string}  Item.color text color of name
   * @param {string}  Item.fillStyle item background color
   * @param {string}  Item.font font of name
   * @param {string}  Item.fontSize font size of name
   * @param {number}  Item.padding item paddings
   * @param {number}  options.radius radius of menu
   * @param {x: number, y: number, z: number}  options.origin origin of menu
   * @param {x: number, y: number, z: number}  options.rotation rotation of menu
   * @param {func}  options.onClick fuction that is executed when click item
   * @param {func}  options.onMoved fuction that is executed when rotate menu
   * @param {Item}  options.selected Item that selected at initialization
   * @param {boolean}  options.isBidirectional flag to decide whether rotation is bidirectional or unidirectional
   * @param {boolean}  options.isReverse flag to change rotation direction
   * @param {number}  options.selectedRotation rotation when Item is selected
   */
  constructor(
    _THREE,
    scene,
    camera,
    canvas,
    {
      items,
      radius,
      origin,
      rotation,
      onClick,
      onMoved,
      selected,
      isBidirectional = false,
      isReverse = false,
      selectedRotation,
    }
  ) {
    this.scene = scene
    this.camera = camera
    this.canvas = canvas
    if(typeof THREE !== 'undefined') {
      this.THREE = THREE
    } else {
      this.THREE = _THREE
    }

    this.radius = radius
    this.wheel = new this.THREE.Object3D() // wrap object
    this.onClick = onClick
    this.onMoved = onMoved

    this.items = items // item params
    this.itemParams = {} // {uuid: item param}
    this.itemList = [] // three.js objects

    this.nextItem = null
    this.currentItem = null
    this.selected = selected ? selected : items[0]

    this.isRotating = false
    this.isBidirectional = isBidirectional
    this.isReverse = isReverse

    this.rotationDirection = 1 // rotation direction ±1
    // vector to point when clicking an item
    this.selectedVector = Math.abs(rotation.x) > Math.abs(rotation.y)
      ? new this.THREE.Vector2(0, Math.sign(rotation.x) || -1)
      : new this.THREE.Vector2(-Math.sign(rotation.y) || -1, 0)
    this.X_VECTOR = new this.THREE.Vector2(1, 0)
    this.ITEM_RATIO = 4

    // apply selectedRotation
    if(selectedRotation) {
      const frontRad = rotToRad(selectedRotation)
      const x = this.radius * Math.cos(frontRad)
      const y = this.radius * Math.sin(frontRad)
      this.selectedVector = new this.THREE.Vector2(x, y)
      this.selectedVector.normalize()
    }

    const itemNum = items.length
    const deg = 360/itemNum

    // apply rotation & oriin to menu
    this.wheel.rotation.x = rotation.x
    this.wheel.rotation.y = rotation.y
    this.wheel.rotation.z = rotation.z
    this.wheel.position.x = origin.x
    this.wheel.position.y = origin.y
    this.wheel.position.z = origin.z

    let rotateRad = 0
    for(let i = 0; i < itemNum; i++) {
      const isCanvas = (items[i] instanceof HTMLElement) && (items[i]?.tagName?.toLowerCase() === 'canvas')
      const rad = rotToRad(i*deg)
      // create par item vector
      const itemVector = new this.THREE.Vector2(
        radius * Math.cos(rad),
        radius * Math.sin(rad),
      )

      const item = isCanvas
        ? this.getCanvasSplite(items[i])
        : this.getTextSplite({
          text: items[i].name,
          width: items[i].width || 300,
          height: items[i].height,
          color: items[i].color || '#000000',
          fillStyle: items[i].fillStyle || '#ffffff',
          font: items[i].font || 'Bold sans-serif',
          fontSize: items[i].size || 20,
          padding: items[i].padding || 10,
        })

      item.position.x = itemVector.x
      item.position.y = itemVector.y

      // rotate to selected item
      if(
        this.selected && isCanvas && this.selected.isEqualNode && this.selected.isEqualNode(items[i])
        || this.selected && !isCanvas && this.selected?.name === items[i].name
      ) {
        rotateRad = this.getAngleToSelected(itemVector) * this.getRotationDirection(itemVector)
        this.currentItem = item
      }

      this.itemParams[item.uuid] = isCanvas ? items[i] : {...items[i]}
 
      // add item
      this.itemList.push(item)
      this.wheel.add(item)
    }
    this.currentItem = this.currentItem || this.itemList[0]
    this.rotateMenu(rotateRad)

    this.addClickEvent()
    scene.add(this.wheel)
 
    // add scroll event
    canvas.addEventListener('wheel', (e) => {
      if(Math.abs(e.deltaY) <= 20) return
      let i = this.itemList.findIndex(item => item.uuid === this.currentItem.uuid)
      i = (e.deltaY > 0)
        ? (i-1) < 0 ? this.itemList.length-1 : (i-1)
        : (i+1) >= this.itemList.length ? 0 : (i+1)
      this.rotateMenuToSelectedPosition(this.itemList[i])
    })
  }

  /**
   * rotate menu
   * @param {number} rad 
   */
  rotateMenu(rad) {
    this.itemList.forEach((item) => {
      const {x, y} = item.position
      const newRad = Math.atan2(y, x) + rad

      const newX = this.radius * Math.cos(newRad)
      const newY = this.radius * Math.sin(newRad)

      item.position.x = newX
      item.position.y = newY
    })
  }

  /**
   * rotate menu to selected position
   * @param {Item} item 
   */
  rotateMenuToSelectedPosition(item) {
    this.nextItem = item
    const vector = new this.THREE.Vector2(item.position.x, item.position.y)
    vector.normalize()
    this.rotationDirection = this.getRotationDirection(vector)
    if(!this.isRotating && this.currentItem.uuid !== this.nextItem.uuid) {
      this.isRotating = true
    }
  }

  /**
   * get radian between any vector & vector to selected positon
   * @param {Three.Vector2} vector 
   * @returns {number} radian between any vector & vector to selected positon
   */
  getAngleToSelected(vector) {
    vector.normalize()
    const frontAngle = getAngle(this.selectedVector.x, this.selectedVector.y)
    const targetAngle = getAngle(vector.x, vector.y)
    let rad = Math.abs(frontAngle - targetAngle)
    rad = angle < 0.1 && angle > 0.01 ? 0 : angle
    return rad
  }

  /**
   * get text size on canvas
   * @param {string} text 
   * @param {string} font 
   * @returns {width: number, height: number} text width & height
   */
  getTextSizeOnCanvas(text, font) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = font
    const {width, actualBoundingBoxAscent, actualBoundingBoxDescent} = context.measureText(text)
    const height = actualBoundingBoxAscent+actualBoundingBoxDescent
    return {width, height}
  }

  /**
   * get rotation direction to selected position as ±1
   * @param {*} vector vector of any item 
   * @returns {number} rotation direction
   */
  getRotationDirection(vector) {
    let sign = 1
    if(!this.isBidirectional) {
      const frontAngle = getAngle(this.selectedVector.x, this.selectedVector.y)
      const targetAngle = getAngle(vector.x, vector.y)
      const subTarget = Math.abs(frontAngle - targetAngle)
      const subFrom360 = Math.abs(Math.PI*2 - subTarget)
      if(frontAngle > targetAngle) {
        sign = subTarget > subFrom360 ? -1 : 1
      } else if(targetAngle > frontAngle) {
        sign = subTarget > subFrom360 ? 1 : -1
      }
    }

    return this.isReverse ? sign * -1 : sign
  }

  /**
   * get Three.Sprite with any string
   * @param {string} params.text
   * @param {number} params.width
   * @param {number} params.height
   * @param {string} params.color
   * @param {string} params.fillStyle
   * @param {string} params.fontStyle
   * @param {number} params.fontSize
   * @param {number} params.padding
   * @returns {Three.Sprite} Three.js Sprite object
   */
  getTextSplite({
    text,
    width = 0,
    height = 0,
    color = '#000',
    fillStyle = '#fff',
    fontStyle = 'sans-serif',
    fontSize = 30,
    padding = 0,
  }) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    const {width: w, height: h} = this.getTextSizeOnCanvas(text, `${fontSize*this.ITEM_RATIO}px ${fontStyle}`)
    canvas.width = (width || w) + padding * 2
    canvas.height = (height || h) + padding * 2

    context.font = `${fontSize*this.ITEM_RATIO}px ${fontStyle}`

    if(fillStyle) {
      context.fillStyle = fillStyle
      context.fillRect(0, 0, width || canvas.width, canvas.height)
    }
    context.fillStyle = color

    const textX = (width || canvas.width)/2 - w/2
    const textY = (height || canvas.height)/2 + h/2

    context.fillText(text, textX, textY)

    const texture = new this.THREE.Texture(canvas) 
    texture.needsUpdate = true
    const material = new this.THREE.SpriteMaterial({map: texture, transparent:false, sizeAttenuation: true })
    const sprite = new this.THREE.Sprite(material)
    sprite.scale.set(canvas.width/this.ITEM_RATIO, canvas.height/this.ITEM_RATIO, 1)
    return sprite
  }

  /**
   * get Three.Sprite with any HTMLCanvasElement
   * @param {HTMLCanvasElement} canvas
   * @returns {Three.Sprite} Three.js Sprite object
   */
  getCanvasSplite(canvas) {
    const texture = new this.THREE.Texture(canvas) 
    texture.needsUpdate = true

    const material = new this.THREE.SpriteMaterial({map: texture, transparent:false, sizeAttenuation: true})
    const sprite = new this.THREE.Sprite(material)
    sprite.scale.set(canvas.width/this.ITEM_RATIO, canvas.height/this.ITEM_RATIO, 1)
    return sprite
  }

  /**
   * add onClick event to wheel menu
   */
  addClickEvent() {
    // register mouse click event
    const mouse = new this.THREE.Vector2()
    const raycaster = new this.THREE.Raycaster()

    const handleMouseClick = (event) => {
      const element = event.currentTarget
      const x = event.clientX - element.offsetLeft
      const y = event.clientY - element.offsetTop
      const w = element.offsetWidth
      const h = element.offsetHeight
      mouse.x = (x / w) * 2 - 1
      mouse.y = -(y / h) * 2 + 1
      raycaster.setFromCamera(mouse, this.camera)
      const intersects = raycaster.intersectObjects(this.wheel.children)
      if(intersects && intersects.length > 0 && intersects[0]?.object) {
        const item = intersects[0]?.object
        if(this.onClick) this.onClick(this.itemParams[item.uuid], item)
        this.rotateMenuToSelectedPosition(item)
      }
    }

    this.canvas.addEventListener('click', handleMouseClick)
  }

  /**
   * execute animation
   */
  tick() {
    if(this.isRotating === false) return
    const angle = this.getAngleToSelected(new this.THREE.Vector2(this.nextItem.position.x, this.nextItem.position.y))
    if(angle > 0.1) {
      this.rotateMenu(0.1*this.rotationDirection)
    } else {
      this.isRotating = false
      this.currentItem = this.nextItem
      if(this.onMoved) this.onMoved(this.itemParams[this.nextItem.uuid], this.nextItem)
    }
  }

}

export default  WheelMenu
window.WheelMenu = WheelMenu
