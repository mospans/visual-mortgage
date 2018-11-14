import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';

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
    // TODO: две запятых - NaN
    // TODO: add validation
    // TODO: убрать изменения при onChange, если они приводят к ошибке

    this.setState({
      [name]: newValue
    });
  };

  render() {
    const loanAmount = this.state.totalPrice - this.state.downPayment;

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
      </div>
    );
  }
}

export default Calc;
