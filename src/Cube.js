import {Mesh} from '../node_modules/react-threejs/src/';
import * as THREE from 'three-js';

class Cube extends Mesh {
  constructor(props) {
    props.geomerty = new THREE.BoxGeometry(1, 1, 1);
    props.material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    super(props);
  }
}

export default Cube;