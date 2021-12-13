import * as THREE from 'three'
import WheelMenu from '../dist/main'
import image1 from './img/undraw_campfire_re_9chj.svg'
import image2 from './img/undraw_interview_re_e5jn.svg'
import image3 from './img/undraw_prototyping_process_re_7a6p.svg'
import image4 from './img/undraw_ride_a_bicycle_re_6tjy.svg'

window.renderImageMenu = async ()=> {
  const canvas = document.querySelector('#canvas2')
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
  })
  renderer.setSize(500, 500)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40)
  camera.position.set(0, 0, 0)

  renderer.setClearColor( 0xffffff, 0);
  camera.position.z=700;
  camera.lookAt(0, 0, 0);

  const canvas1 = document.createElement('canvas')
  const canvas2 = document.createElement('canvas')
  const canvas3 = document.createElement('canvas')
  const canvas4 = document.createElement('canvas')

  canvas1.setAttribute('id', 'item1')
  canvas2.setAttribute('id', 'item2')
  canvas3.setAttribute('id', 'item3')
  canvas4.setAttribute('id', 'item4')

  await Promise.all([
    {c: canvas1, src: image1},
    {c: canvas2, src: image2},
    {c: canvas3, src: image3},
    {c: canvas4, src: image4},
  ].map((obj) => {
    return new Promise(resolve => {
      const ctx = obj.c.getContext('2d')
      const img = new Image()
      img.onload = function() {
        obj.c.width = img.width/2
        obj.c.height = img.height/2
        ctx.drawImage(img, 0, 0, img.width/2, img.height/2)
        resolve()
      }
      img.src = obj.src
    })
  }))

  const items = [
    canvas1,
    canvas2,
    canvas3,
    canvas4,
  ]

  const onClick = async (info, object) => {
    document.getElementById('selectedElement').innerText = `id: ${info.getAttribute('id')} uuid: ${object.uuid}`
  }

  const wheelMenu = new WheelMenu(
    THREE,
    scene,
    camera,
    canvas,
    {
      radius: 150,
      origin: {x: 0, y: 0, z: 0},
      rotation: {x: 1.3, y: 0, z: 0},
      items,
      onClick,
      selected: canvas3,
    }
  )

  /* start loop event */
  tick();
  function tick() {
    // rendering
    wheelMenu.tick();
    renderer.render(scene, camera);

    // call next tick
    requestAnimationFrame(tick);

   }
}
