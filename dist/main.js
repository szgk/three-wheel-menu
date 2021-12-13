function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $a133e694903d6523$export$2e2bcd8739ae039);
const $e15726cc9f000015$export$b363da9ded343252 = (x, y)=>{
    if (y === 0) return x >= 0 ? 0 : Math.PI;
    const a2 = Math.atan2(y, x);
    if (a2 > 0) return a2;
    else return Math.PI * 2 + a2;
};
const $e15726cc9f000015$export$e14086d5b9db11ed = (rot)=>rot * (Math.PI / 180)
;
const $e15726cc9f000015$export$9c9105cca1222f52 = (rad)=>rad * (180 / Math.PI)
;
const $e15726cc9f000015$export$dc415335785a9a04 = (v1, v2)=>Math.acos(v1.dot(v2) / (v1.length() * v2.length())) || 0
;


class $a133e694903d6523$var$WheelMenu {
    constructor(_THREE, scene, camera, canvas, { items: items , radius: radius , origin: origin , rotation: rotation , onClick: onClick , selected: selected , isBidirectional: isBidirectional = false , isReverse: isReverse = false , selectedRotation: selectedRotation ,  }){
        this.scene = scene;
        this.camera = camera;
        this.canvas = canvas;
        if (typeof THREE !== 'undefined') this.THREE = THREE;
        else this.THREE = _THREE;
        this.radius = radius;
        this.wheel = new this.THREE.Object3D() // wrap object
        ;
        this.onClick = onClick;
        this.items = items // item params
        ;
        this.itemParams = {
        } // {uuid: item param}
        ;
        this.itemList = [] // three.js objects
        ;
        this.nextItem = null;
        this.currentItem = null;
        this.selected = selected ? selected : items[0];
        this.isRotating = false;
        this.isBidirectional = isBidirectional;
        this.isReverse = isReverse;
        this.rotationDirection = 1 // rotation direction ±1
        ;
        // vector to point when clicking an item
        this.selectedVector = Math.abs(rotation.x) > Math.abs(rotation.y) ? new this.THREE.Vector2(0, Math.sign(rotation.x) || -1) : new this.THREE.Vector2(-Math.sign(rotation.y) || -1, 0);
        this.X_VECTOR = new this.THREE.Vector2(1, 0);
        this.ITEM_RATIO = 4;
        if (selectedRotation) {
            const frontRad = $e15726cc9f000015$export$e14086d5b9db11ed(selectedRotation);
            const x = this.radius * Math.cos(frontRad);
            const y = this.radius * Math.sin(frontRad);
            this.selectedVector = new this.THREE.Vector2(x, y);
            this.selectedVector.normalize();
        }
        const itemNum = items.length;
        const deg = 360 / itemNum;
        this.wheel.rotation.x = rotation.x;
        this.wheel.rotation.y = rotation.y;
        this.wheel.rotation.z = rotation.z;
        this.wheel.position.x = origin.x;
        this.wheel.position.y = origin.y;
        this.wheel.position.z = origin.z;
        let rotateRad = 0;
        for(let i1 = 0; i1 < itemNum; i1++){
            const isCanvas = items[i1] instanceof HTMLElement && items[i1]?.tagName?.toLowerCase() === 'canvas';
            const rad = $e15726cc9f000015$export$e14086d5b9db11ed(i1 * deg);
            // create par item vector
            const itemVector = new this.THREE.Vector2(radius * Math.cos(rad), radius * Math.sin(rad));
            const item = isCanvas ? this.createCanvasSplite(items[i1]) : this.createTextSplite({
                text: items[i1].name,
                width: items[i1].width || 300,
                height: items[i1].height,
                color: items[i1].color || '#000000',
                fillStyle: items[i1].fillStyle || '#ffffff',
                font: items[i1].font || 'Bold sans-serif',
                fontSize: items[i1].size || 20,
                padding: items[i1].padding || 10
            });
            item.position.x = itemVector.x;
            item.position.y = itemVector.y;
            // rotate to selected item
            if (this.selected && isCanvas && this.selected.isEqualNode && this.selected.isEqualNode(items[i1]) || this.selected && !isCanvas && this.selected?.name === items[i1].name) {
                rotateRad = this.getAngleToSelected(itemVector) * this.getRotationDirection(itemVector);
                this.currentItem = item;
            }
            this.itemParams[item.uuid] = isCanvas ? items[i1] : {
                ...items[i1]
            };
            // add item
            this.itemList.push(item);
            this.wheel.add(item);
        }
        this.currentItem = this.currentItem || this.itemList[0];
        this.rotateMenu(rotateRad);
        this.addClickEvent();
        scene.add(this.wheel);
        // add scroll event
        canvas.addEventListener('wheel', (e)=>{
            if (Math.abs(e.deltaY) <= 20) return;
            let i = this.itemList.findIndex((item)=>item.uuid === this.currentItem.uuid
            );
            i = e.deltaY > 0 ? i - 1 < 0 ? this.itemList.length - 1 : i - 1 : i + 1 >= this.itemList.length ? 0 : i + 1;
            this.moveToItem(this.itemList[i]);
        });
    }
    rotateMenu(rad) {
        this.itemList.forEach((item)=>{
            const { x: x , y: y  } = item.position;
            const newRad = Math.atan2(y, x) + rad;
            const newX = this.radius * Math.cos(newRad);
            const newY = this.radius * Math.sin(newRad);
            item.position.x = newX;
            item.position.y = newY;
        });
    }
    moveToItem(item1) {
        this.nextItem = item1;
        const vector = new this.THREE.Vector2(item1.position.x, item1.position.y);
        vector.normalize();
        this.rotationDirection = this.getRotationDirection(vector);
        if (!this.isRotating && this.currentItem.uuid !== this.nextItem.uuid) this.isRotating = true;
    }
    getAngleToSelected(vector) {
        vector.normalize();
        const frontAngle = $e15726cc9f000015$export$b363da9ded343252(this.selectedVector.x, this.selectedVector.y);
        const targetAngle = $e15726cc9f000015$export$b363da9ded343252(vector.x, vector.y);
        let angle = Math.abs(frontAngle - targetAngle);
        angle = angle < 0.1 && angle > 0.01 ? 0 : angle;
        return angle;
    }
    getTextSizeOnCanvas(text, font) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = font;
        const { width: width , actualBoundingBoxAscent: actualBoundingBoxAscent , actualBoundingBoxDescent: actualBoundingBoxDescent  } = context.measureText(text);
        const height = actualBoundingBoxAscent + actualBoundingBoxDescent;
        return {
            width: width,
            height: height
        };
    }
    getRotationDirection(vector1) {
        let sign = 1;
        if (!this.isBidirectional) {
            const frontAngle = $e15726cc9f000015$export$b363da9ded343252(this.selectedVector.x, this.selectedVector.y);
            const targetAngle = $e15726cc9f000015$export$b363da9ded343252(vector1.x, vector1.y);
            const subTarget = Math.abs(frontAngle - targetAngle);
            const subFrom360 = Math.abs(Math.PI * 2 - subTarget);
            if (frontAngle > targetAngle) sign = subTarget > subFrom360 ? -1 : 1;
            else if (targetAngle > frontAngle) sign = subTarget > subFrom360 ? 1 : -1;
        }
        return this.isReverse ? sign * -1 : sign;
    }
    createTextSplite({ text: text1 , width: width = 0 , height: height = 0 , color: color = '#000' , fillStyle: fillStyle = '#fff' , fontStyle: fontStyle = 'sans-serif' , fontSize: fontSize = 30 , padding: padding = 0 ,  }) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const { width: w , height: h  } = this.getTextSizeOnCanvas(text1, `${fontSize * this.ITEM_RATIO}px ${fontStyle}`);
        canvas.width = (width || w) + padding * 2;
        canvas.height = (height || h) + padding * 2;
        context.font = `${fontSize * this.ITEM_RATIO}px ${fontStyle}`;
        if (fillStyle) {
            context.fillStyle = fillStyle;
            context.fillRect(0, 0, width || canvas.width, canvas.height);
        }
        context.fillStyle = color;
        const textX = (width || canvas.width) / 2 - w / 2;
        const textY = (height || canvas.height) / 2 + h / 2;
        context.fillText(text1, textX, textY);
        const texture = new this.THREE.Texture(canvas);
        texture.needsUpdate = true;
        const material = new this.THREE.SpriteMaterial({
            map: texture,
            transparent: false,
            sizeAttenuation: true
        });
        const sprite = new this.THREE.Sprite(material);
        sprite.scale.set(canvas.width / this.ITEM_RATIO, canvas.height / this.ITEM_RATIO, 1);
        return sprite;
    }
    createCanvasSplite(canvas1) {
        const texture = new this.THREE.Texture(canvas1);
        texture.needsUpdate = true;
        const material = new this.THREE.SpriteMaterial({
            map: texture,
            transparent: false,
            sizeAttenuation: true
        });
        const sprite = new this.THREE.Sprite(material);
        sprite.scale.set(canvas1.width / this.ITEM_RATIO, canvas1.height / this.ITEM_RATIO, 1);
        return sprite;
    }
    addClickEvent() {
        // register mouse click event
        const mouse = new this.THREE.Vector2();
        const raycaster = new this.THREE.Raycaster();
        const handleMouseClick = (event)=>{
            const element = event.currentTarget;
            const x = event.clientX - element.offsetLeft;
            const y = event.clientY - element.offsetTop;
            const w = element.offsetWidth;
            const h = element.offsetHeight;
            mouse.x = x / w * 2 - 1;
            mouse.y = -(y / h) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.wheel.children);
            if (intersects && intersects.length > 0 && intersects[0]?.object) {
                const item = intersects[0]?.object;
                this.onClick(this.itemParams[item.uuid], item);
                this.moveToItem(item);
            }
        };
        this.canvas.addEventListener('click', handleMouseClick);
    }
    tick() {
        if (this.isRotating === false) return;
        const angle = this.getAngleToSelected(new this.THREE.Vector2(this.nextItem.position.x, this.nextItem.position.y));
        if (angle > 0.1) this.rotateMenu(0.1 * this.rotationDirection);
        else {
            this.isRotating = false;
            this.currentItem = this.nextItem;
        }
    }
}
var $a133e694903d6523$export$2e2bcd8739ae039 = $a133e694903d6523$var$WheelMenu;
window.WheelMenu = $a133e694903d6523$var$WheelMenu;


//# sourceMappingURL=main.js.map
