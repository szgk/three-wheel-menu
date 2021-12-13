[DEMO](https://szgk.github.io/three-wheel-menu/sample/dist/index.html)

![wheel_menu](https://github.com/szgk/three-wheel-menu/blob/master/sample/img/wheel_menu.gif)

## Usage

```js
import * as THREE from 'three'

const items = [
  {name: 'Skill'},
  {name: 'Profile'},
  {name: 'Work'},
];

const wheelMenu = new WheelMenu({
  THREE, // It's not necessary if you use CDN
  scene,
  canvas,
  camera,
  radius: 150,
  origin: {x: 0, y: 0, z: 0},
  rotation: {x: 0, y: 1.64, z: 0},
  items,
  onClick,
});

tick();
function tick() {
  wheelMenu.tick();
  requestAnimationFrame(tick);
}
```

## Paramater

```js
  new WheelMenu(
    THREE, // import * as THREE from 'three'
    scene, // THREE.Scene()
    camera, // THREE.PerspectiveCamera
    canvas, // canvas element
    options // optional values
  )
```

| name | type | description |
-- | -- | --
| items | Array<HTMLCanvasElement \| `{name: string, width: number, height: number, color: string, fillStyle: string, font: string,fontSize: number, padding: number}`> | menu items. default value is `{width: 300,height: font height, color: '#000000',fillStyle: '#ffffff',font: 'Bold sans-serif',fontSize: 20,padding: 10,}` |
| radius | number | radius of menu |
| origin | `{x: number, y: number, z: number}` | origin of menu. |
| rotation | `{x: number, y: number, z: number}` | rotation of menu. number is rad. (±0~2π)  |
| onClick | function | function that is executed when item is clicked. |
| selected | HTMLCanvasElement \| `{name: string, ...}` | default selected item. |
| isBidirectional | bool | flag that decide rotation direction bidirect or unidirect. |
| isReverse | bool | flag that rotation direction. |
| selectedRotation | number | digree when item selected. (±0~360) |

## Sample

### Use image
```js
const img = new Image()
const canvas1 = document.createElement('canvas')
const context = canvas.getContext('2d')

canvas1.setAttribute('id', 'item1') // add id if you use `selected`

await new Promise(resolve => {
  img.onload = function(res) {
    console.log(img.width)
    canvas.width = img.width/2
    canvas.height = img.height/2
    context.drawImage(img, 0, 0, img.width/2, img.height/2);
    resolve()
  }
  img.src = '/image/path';
})

const items = [canvas1, image2, ...]
```

### Use html element

```js
import html2canvas from 'html2canvas'

const target = document.getElementById('item1')
const element1 = await new Promise((res) => {
  html2canvas(target).then(function(c) {
    c.setAttribute('id', target.getAttribute('id')) // add id if you use `selected`
    res(c)
  });
})

const items = [element1, element2, ...]
```

```html
<div style="height: 0px; overFlow: 'hidden';">
  <div id="item1">dom element1</div>
  <div id="item2">dom element2</div>
  <div id="item3">dom element3</div>
  <div id="item4">dom element4</div>
</div>
```

```css
#menu1 {
  width: 180px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  background: linear-gradient(90deg, rgba(3,255,231,1) 0%, rgba(255,255,255,0.580392156862745) 81%);
  border-radius: 10px;
}
```