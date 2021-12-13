import * as THREE from 'three'
import html2canvas from 'html2canvas'
import WheelMenu from '../dist/main'

window.renderDomMenu = async ()=> {
  const canvas = document.querySelector('#canvas3')
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

  const [
    canvas1,
    canvas2,
    canvas3,
    canvas4,
  ] = await Promise.all([
    document.getElementById('item1'),
    document.getElementById('item2'),
    document.getElementById('item3'),
    document.getElementById('item4'),
  ].map((target) => {
    return new Promise((res) => {
      html2canvas(target, {backgroundColor: 'transparent'}).then(function(c) {
        c.setAttribute('id', target.getAttribute('id'))
        res(c)
      });
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
      rotation: {x: 1, y: 0.9, z: 0},
      items,
      onClick,
      selected: canvas2,
      selectedRotation: 130,
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
