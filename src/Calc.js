import React, {Component} from 'react';
import isNumeric from './isNumeric'
import Input from 'react-toolbox/lib/input';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import './assets/react-toolbox/theme.css';
import theme from './assets/react-toolbox/theme.js';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import * as validators from './validators';

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
      interestRate: 9.5,
      months: 120,

      cameraAngle: 0,
    };

    this.lightTarget = new THREE.Vector3(0, 0, 0);
  }

  round2 = number => Math.round(number * 100) / 100;

  prettifyNumber = number => this.round2(number).toLocaleString(LOCALE);

  formatNumeric = name => this.state.fieldEdit !== name
    ? this.prettifyNumber(this.state[name])
    : this.state[name];

  onFocus = name => () => this.setState({fieldEdit: name});

  onBlur = () => () => {
    this.setState({fieldEdit: null});
  };

  handleNumeric = (name, value) => {
    const newValue = +(
      value
        .replace(DECIMAL_SEPARATOR, DEFAULT_DECIMAL_SEPARATOR)
        .replace(/[^0-9.]/g, '')
    );
    // save invalid string to state?

    if (
      newValue !== this.state[name]
      && isNumeric(value)
      && this.validate(name, value)
    ) {
      this.setState({
        [name]: newValue
      });
    }
  };

  validate = (name, value) => {
    const rules = this.validationRules(name);
    for (const [rule, ruleValue] of Object.entries(rules)) {
      if (
        !validators[rule]
        || !validators[rule](value, ruleValue)
      ) {
        return false;
      }
    }

    return true;
  };

  validationRules = (name) => {
    const rules = {
      totalPrice: {
        max: 15000000,
        min: this.state.downPayment // TODO: run validation for all rules, in order to  avoid duplicate rules
      },
      downPayment: {
        max: this.state.totalPrice
      },
      interestRate: {
        min: 0.1,
        max: 15
      },
      months: {
        min: 12,
        max: 360
      },
    };

    return rules[name] || {};
  };

  _onAnimate = () => {
    // TODO: add smooth animation of diagram
    this.setState({
      cameraAngle: this.state.cameraAngle + Math.PI / 360
    });
  };

  render() {
    const loanAmount = this.state.totalPrice - this.state.downPayment,
      monthlyRate = this.state.interestRate / 100 / 12,
      monthlyPayment = loanAmount * (monthlyRate + monthlyRate / (Math.pow(1 + monthlyRate, this.state.months) - 1)),
      overpayment = monthlyPayment * this.state.months - loanAmount;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const maxHeight = 7,
      maxValue = overpayment > this.state.totalPrice ? overpayment : this.state.totalPrice,
      downPaymentHeight = this.round2(maxHeight * this.state.downPayment / maxValue),
      loanAmountHeight = this.round2(maxHeight * loanAmount / maxValue),
      overpaymentHeight = this.round2(maxHeight * overpayment / maxValue);
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
      <ThemeProvider theme={theme}>
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
                  color={0x444488}
                />
              </mesh>
              <mesh
                castShadow
                receiveShadow

                position={new THREE.Vector3(0, downPaymentHeight / 2, 0)}
              >
                <boxGeometry
                  width={1}
                  height={downPaymentHeight}
                  depth={1}
                />
                <meshStandardMaterial
                  color={0x448844}
                />
              </mesh>
              <mesh
                castShadow
                receiveShadow

                position={new THREE.Vector3(1, overpaymentHeight / 2, 0)}
              >
                <boxGeometry
                  width={1}
                  height={overpaymentHeight}
                  depth={1}
                />
                <meshStandardMaterial
                  color={0x884444}
                />
              </mesh>
            </scene>
          </React3>
          <h1>Ипотечный калькулятор</h1>
          <section className={'inputs'}>
            <Input
              type="text"
              name="totalPrice"
              value={this.formatNumeric('totalPrice')}
              onFocus={this.onFocus('totalPrice')}
              onBlur={this.onBlur('totalPrice')}
              onChange={this.handleNumeric.bind(this, 'totalPrice')}
              label="Стоимость квартиры"
            />
            <Input
              type="text"
              name="downPayment"
              value={this.formatNumeric('downPayment')}
              onFocus={this.onFocus('downPayment')}
              onBlur={this.onBlur('downPayment')}
              onChange={this.handleNumeric.bind(this, 'downPayment')}
              label="Первоначальный взнос"
            />
            <Input
              type="text"
              name="loanAmount"
              disabled={true}
              value={this.prettifyNumber(loanAmount)}
              label="Размер кредита"
            />
            <Input
              type="text"
              name="interestRate"
              value={this.formatNumeric('interestRate')}
              onFocus={this.onFocus('interestRate')}
              onBlur={this.onBlur('interestRate')}
              onChange={this.handleNumeric.bind(this, 'interestRate')}
              label="Ставка"
            />
            <Input
              type="text"
              name="months"
              value={this.formatNumeric('months')}
              onFocus={this.onFocus('months')}
              onBlur={this.onBlur('months')}
              onChange={this.handleNumeric.bind(this, 'months')}
              label="Срок"
            />
            <Input
              type="text"
              name="monthlyPayment"
              disabled={true}
              value={this.prettifyNumber(monthlyPayment)}
              label="Ежемесячный платеж"
            />
            <Input
              type="text"
              name="overpayment"
              disabled={true}
              value={this.prettifyNumber(overpayment)}
              label="Размер переплаты"
            />
          </section>
        </div>
      </ThemeProvider>
    );
  }
}

export default Calc;
