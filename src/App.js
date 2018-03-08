import React, { Component } from 'react'
import rgbHex from 'rgb-hex'
import ColorThief from 'color-thief'
import './App.css'

require('tracking')
require('tracking/build/data/face')


class App extends Component {

  state = {
    colors: [],
    face: 0
  }

  tracker = null

  componentDidMount(){
    var colorThief = new ColorThief();
    
    this.tracker = new window.tracking.ObjectTracker('face')
        this.tracker.setInitialScale(4)
        this.tracker.setStepSize(2)
        this.tracker.setEdgesDensity(0.1)
        this.refs.imageNew.width = this.refs.cameraOutput.clientWidth;
        this.refs.imageNew.height = this.refs.cameraOutput.clientHeight;
        window.tracking.track(this.refs.cameraOutput, this.tracker, { camera: true })
        this.tracker.on('track', event => {
          let context = this.refs.canvas.getContext('2d')
          let newContext = this.refs.imageNew.getContext('2d')
          var scaleX = this.refs.cameraOutput.videoWidth/this.refs.canvas.width
          var scaleY = this.refs.cameraOutput.videoHeight/this.refs.canvas.height
           if(event.data.length > 0 ){
          //   console.log(event.data[0].height)
             this.refs.imageNew.height = event.data[0].width*scaleX
             this.refs.imageNew.width = this.refs.cameraOutput.videoWidth-(event.data[0].y)*scaleY
             //newContext.clearRect(0, 0, 640, 480)
             console.log(this.refs.cameraOutput.videoWidth-(event.data[0].y)*scaleY)
             newContext.drawImage(this.refs.cameraOutput,
              (event.data[0].height+event.data[0].y)*scaleY,
              (this.refs.cameraOutput.videoHeight/2)-event.data[0].x*scaleX,
              this.refs.cameraOutput.videoWidth-(event.data[0].y)*scaleY,
              event.data[0].width*scaleX,
              0,
              0,
              this.refs.cameraOutput.videoWidth-(event.data[0].y)*scaleY,
              event.data[0].width*scaleX
            )
            // console.log(this.refs.canvas.toDataURL())
            //this.setState({face:1})

            var t = colorThief.getPalette(this.refs.imageNew, 10);

            var c = t.map((color) =>{
              return rgbHex(color[0], color[1], color[2])
            })

            this.setState({colors: c})
          }
          context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height)
          event.data.forEach(function(rect) {
            context.strokeStyle = '#f00'
            context.strokeRect(rect.y, 560-(rect.x), rect.height, rect.width)
            context.font = '11px Helvetica'
            context.fillStyle = "#fff"
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11)
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22)
          })
        })
  }

  componentWillUnmount () {
    this.tracker.removeAllListeners()
  }

  render() {
    return (
      <div className="App">
        <div>
          <canvas ref="imageNew" className="newImage" ></canvas>
          <video className="oldImage" ref="cameraOutput" height="720" width="1280" preload="true" autoPlay loop muted></video> 
          <canvas className="oldImage" ref="canvas" height="720" width="1280"></canvas>
          <div className="boxes">
            {this.state.colors.map((color) => {
              return <div key={color} className="smallBox" style={{ backgroundColor: '#'+color}}/>
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
