import React, {Component} from 'react';
import {Renderer, Camera, Scene} from '../node_modules/react-threejs/src/';
import TextField from '@material-ui/core/TextField';
import Cube from './Cube'

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
    };
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

  render() {
    const loanAmount = this.state.totalPrice - this.state.downPayment,
      rendererSize = [200, 200],
      rotation = 0;

    return (
      <div>
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
        <Renderer size={rendererSize}>
          <Camera position={{z: 5}}/>
          <Scene>
            <Cube color={0x00ff00} rotation={rotation}>
              <Cube color={0xff0000} position={{y: 2}}/>
              <Cube color={0x0000ff} position={{z: 3}}/>
            </Cube>
          </Scene>
        </Renderer>
      </div>
    );
  }
}

export default Calc;
