import * as THREE from 'three'
import WheelMenu from '../dist/main'

window.renderTextMenu = async ()=> {
  const canvas = document.querySelector('#canvas1')

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

  const items = [
    {name: 'Skill'},
    {name: 'Profile'},
    {name: 'Work'},
    {name: 'Work2'},
  ]

  document.getElementById('selectedElement').innerText = items[0].name
  const onClick = async (info, object) => {
    document.getElementById('selectedElement').innerText = info.name
  }

  const wheelMenu = new WheelMenu(
    THREE,
    scene,
    camera,
    canvas,
    {
      radius: 150,
      origin: {x: 0, y: 0, z: 0},
      rotation: {x: 0, y: 1.2, z: 0},
      items,
      onClick,
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
