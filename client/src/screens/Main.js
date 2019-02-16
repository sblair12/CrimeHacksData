// IMPORT COMPONENTS
import React, { Component } from 'react';
import 'whatwg-fetch';

class App extends Component {

  // Component constructor
  constructor(props) {
    super(props);

    this.state = {
		test: ""
    };
  }

  componentDidMount() {

  }
  
  test = (e) => {
    e.preventDefault();
    fetch('/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test: "test"
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          console.log(json.message);
        }
    });
  }

  render() {

    return (
      <div>
		<button onClick={(e) => {this.test(e)}}>Test</button>
      </div>
    );
  }
}
export default App;
