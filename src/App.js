import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputURL: '',
      startTime: '',
      endTime: '',
      videoID: '',
      completeData: false
    };
  }

  handleChangeURL(i) {
		this.setState(
      {
        inputURL: i.target.value,
        completeData: false
      }
    );
  }

  handleChangeStart(i) {
		this.setState(
      {
        startTime: i.target.value,
        completeData: false
      }
    );
  }

  handleChangeEnd(i) {
		this.setState(
      {
        endTime: i.target.value,
        completeData: false
      }
    );
  }
  
  handleSubmit(i) {
    // If data is all there
    if(this.state.inputURL !== '' && this.state.startTime !== '' && this.state.endTime !== '') {
      console.log("data there" + this.state.inputURL + this.state.startTime + this.state.endTime + " ");
			// Extract video ID from original Youtube URL
			extractID(this.state.inputURL, (id) => {
				if(id !== 0) {
					this.setState({startTime: convertToSeconds(this.state.startTime), endTime: convertToSeconds(this.state.endTime), videoID: id, completeData: true});
				}
				else {
					// Invalid URL
					this.setState({completeData: false});
				}
			});
		}
		else {
			this.setState({completeData: false});
		}
	}

  render() {
    var inputURL = this.state.inputURL;
    var startTime = this.state.startTime;
    var endTime = this.state.endTime;
    var output;

    if (this.state.completeData) {
      output = <ClippedURLOutput id={this.state.videoID} start={this.state.startTime} end={this.state.endTime} />;
    }
    else {
      output = '';
    }


    return (
      <div className="App">
        <h1>Youtube Clipper</h1>
        <p>Paste the Youtube URL you'd like to clip with the start and end time to get a new URL to share.</p>
        <label htmlFor="input-url">
          Youtube URL
          <input 
            id="input-url"
            type="text"
            value={inputURL}
            onChange={(i) => this.handleChangeURL(i)}
            autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
          />
        </label>
        <label htmlFor="input-start">
          Start Time
          <input 
            id="input-start"
            type="text"
            value={startTime}
            onChange={(i) => this.handleChangeStart(i)}
          />
        </label>
        <label htmlFor="input-end">
          End Time
          <input 
            id="input-end"
            type="text"
            value={endTime}
            onChange={(i) => this.handleChangeEnd(i)}
          />
        </label>
        <button onClick={(i) => this.handleSubmit(i)}>
					Get Clipped URL
				</button>

        {output}
      </div>
    );
  }
}



function ClippedURLOutput(props) {
	return (
    // Create new URL with clipping
    // "https://www.youtube.com/embed/" + {ID Code} + "?start=" + {seconds} + "&end=" + {seconds}
		<pre>https://www.youtube.com/embed/{props.id}?start={props.start}&end={props.end}</pre>
	);
}

function extractID(url, callback) {
  console.log(url);
  
  // Find url in string
	var exp = /(\b(((https?|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	var parsedUrl = url.match(exp);

	if ((typeof parsedUrl !== "undefined" && parsedUrl !== null) ) {
		parsedUrl = parsedUrl[0];
    
		if (parsedUrl.indexOf('https://www.youtube.com/watch?v=') !== -1) {
      var startPosition = url.indexOf('v=') + 2;
      var endPosition = startPosition + 11;
			//var endPosition = url.indexOf('&');
			var id = url.substring(startPosition, endPosition);

			callback(id);
    }
    else if (parsedUrl.indexOf('https://youtu.be/') !== -1) {
      var startPosition = url.indexOf('.be/') + 4;
      var endPosition = startPosition + 11;
			var id = url.substring(startPosition, endPosition);

			callback(id);
    }
		else {
			console.log("Unknown URL. Error handle");
			callback(0);
		}	
	}
}

function convertToSeconds(time) {
  console.log("Converting time");
  console.log(time);

  time = time + "";

  if (time.indexOf(':') !== -1) {
    var timeArray = time.split(':');

    if (timeArray.length === 3) {
      // Hours, minutes, and seconds
      var seconds = (+timeArray[0]) * 60 * 60 + (+timeArray[1]) * 60 + (+timeArray[2]); 
    }
    else if (timeArray.length === 2) {
      // Minutes and seconds
      var seconds = (+timeArray[0]) * 60 + (+timeArray[1]);
    }
  }
  else {
    // Minutes and seconds
    var seconds = time;
  }

  return seconds;
}


export default App;
