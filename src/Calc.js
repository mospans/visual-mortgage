import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

const LOCALE = 'ru-RU',
  DEFAULT_DECIMAL_SEPARATOR = '.',
  DECIMAL_SEPARATOR = ',';

class Calc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldEdit: null,
      totalPrice: 2000000,
      downPayment: 200000,

      cameraAngle: 0,
    };

    this.lightTarget = new THREE.Vector3(0, 0, 0);
  }

  formatNumeric = name => this.state.fieldEdit !== name ? this.state[name].toLocaleString(LOCALE) : this.state[name];

  onFocus = name => () => this.setState({fieldEdit: name});

  onBlur = () => () => this.setState({fieldEdit: null});

  handleNumeric = name => event => {
    const newValue = +(
      event.target.value
        .replace(DECIMAL_SEPARATOR, DEFAULT_DECIMAL_SEPARATOR)
        .replace(/[^0-9.]/g, '')
    );
    // TODO: add validation schema
    // save invalid string to state?

    if (
      newValue !== this.state[name]
      && this.isNumeric(event.target.value)
    ) {
      this.setState({
        [name]: newValue
      });
    }
  };

  isNumeric = value => {
    const numeric = (+(value.replace(DECIMAL_SEPARATOR, DEFAULT_DECIMAL_SEPARATOR)));
    if (isNaN(numeric)) {
      return false;
    }

    return numeric.toString(10) === value;
  };

  _onAnimate = () => {

    this.setState({
      cameraAngle: this.state.cameraAngle + Math.PI / 360
    });
  };

  render() {
    const loanAmount = this.state.totalPrice - this.state.downPayment;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const totalPriceHeight = 7;
    const downPaymentHeight = Math.round(100 * totalPriceHeight * this.state.downPayment / this.state.totalPrice) / 100;
    const loanAmountHeight = Math.round(100 * totalPriceHeight * loanAmount / this.state.totalPrice) / 100;
    const cameraPosition = new THREE.Vector3(
      9 * Math.sin(this.state.cameraAngle),
      3,
      9 * Math.sin(Math.PI / 2 - this.state.cameraAngle)
      ),
      cameraRotation = new THREE.Euler(
        0,
        this.state.cameraAngle,
        0
      ),
      lightPosition = new THREE.Vector3(
        9 * Math.sin(this.state.cameraAngle),
        3,
        9 * Math.sin(Math.PI / 2 - this.state.cameraAngle)
      );

    return (
      <div>
        <React3
          mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
          width={width}
          height={height}
          clearColor={new THREE.Color(0xdddddd)}
          onAnimate={this._onAnimate}
        >
          <scene>
            <perspectiveCamera
              name="camera"
              fov={75}
              aspect={width / height}
              near={0.1}
              far={1000}
              position={cameraPosition}
              rotation={cameraRotation}
            />
            <ambientLight
              color={0x505050}
            />
            <spotLight
              color={0xffffff}
              intensity={1.5}
              position={lightPosition}
              lookAt={this.lightTarget}

              castShadow
              shadowCameraNear={200}
              shadowCameraFar={10000}
              shadowCameraFov={50}

              shadowBias={-0.00022}

              shadowMapWidth={2048}
              shadowMapHeight={2048}
            />
            <mesh
              castShadow
              receiveShadow

              position={new THREE.Vector3(0, loanAmountHeight / 2 + downPaymentHeight, 0)}
            >
              <boxGeometry
                width={1}
                height={loanAmountHeight}
                depth={1}
              />
              <meshStandardMaterial
                color={0x448844}
              />
            </mesh>
            <mesh
              castShadow
              receiveShadow

              position={new THREE.Vector3(0 , downPaymentHeight / 2, 0)}
            >
              <boxGeometry
                width={1}
                height={downPaymentHeight}
                depth={1}
              />
              <meshStandardMaterial
                color={0x444488}
              />
            </mesh>
          </scene>
        </React3>
        <h1>Ипотечный калькулятор</h1>
        <TextField
          type="text"
          value={this.formatNumeric('totalPrice')}
          onFocus={this.onFocus('totalPrice')}
          onBlur={this.onBlur('totalPrice')}
          onChange={this.handleNumeric('totalPrice')}
          helperText="Стоимость квартиры"
        />
        <TextField
          type="text"
          value={this.formatNumeric('downPayment')}
          onFocus={this.onFocus('downPayment')}
          onBlur={this.onBlur('downPayment')}
          onChange={this.handleNumeric('downPayment')}
          helperText="Первоначальный взнос"
        />
        <TextField
          type="text"
          disabled={true}
          value={loanAmount}
          helperText="Размер кредита"
        />
      </div>
    );
  }
}

export default Calc;
