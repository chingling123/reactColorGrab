import React, { Component } from 'react';
import rgbHex from 'rgb-hex'
import Palette from 'react-palette'
import './App.css';
import ColorThief from 'color-thief'

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
            console.log(event.data[0].height)
            this.refs.imageNew.width = event.data[0].width*scaleX
            this.refs.imageNew.height = this.refs.cameraOutput.clientHeight-((event.data[0].y+event.data[0].height)*scaleY)
            // newContext.clearRect(0, 0, 640, 480)
            newContext.drawImage(this.refs.cameraOutput, 
              event.data[0].x*scaleX, 
              (event.data[0].y+event.data[0].height)*scaleY,
              event.data[0].width*scaleX,
              this.refs.cameraOutput.videoHeight-((event.data[0].y+event.data[0].height)*scaleY),
              0,
              0,
              event.data[0].width*scaleX, 
              this.refs.cameraOutput.videoHeight-((event.data[0].y+event.data[0].height)*scaleY)
            )
            // console.log(this.refs.canvas.toDataURL())
            this.setState({face:1})

            var t = colorThief.getPalette(this.refs.imageNew, 10);

            var c = t.map((color) =>{
              return rgbHex(color[0],color[1],color[2])
            })

            this.setState({colors: c})
          }
          context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height)
          event.data.forEach(function(rect) {
            context.strokeStyle = '#f00'
            context.strokeRect(rect.x, rect.y, rect.width, rect.height)
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
        <div className="demo-container">
          <canvas ref="imageNew" className="newImage" ></canvas>
          <video className="oldImage" ref="cameraOutput" height="480" width="640" preload="true" autoPlay loop muted></video> 
          <canvas className="oldImage" ref="canvas" height="480" width="640"></canvas>
          <div>
            {this.state.colors.map((color) => {
              return <div style={{ backgroundColor: '#'+color, width:50, height:50 }}/>
            })}
          </div>
          {/* <Palette image={this.state.image}>
            {palette => (
              <div>
                <div style={{ backgroundColor: palette.vibrant, width:50, height:50 }}/>
                <div style={{ backgroundColor: palette.darkMuted, width:50, height:50 }}/>
                <div style={{ backgroundColor: palette.darkVibrant, width:50, height:50 }}/>
                <div style={{ backgroundColor: palette.lightMuted, width:50, height:50 }}/>
                <div style={{ backgroundColor: palette.lightVibrant, width:50, height:50 }}/>
                <div style={{ backgroundColor: palette.muted, width:50, height:50 }}/>
              </div>
            )}
          </Palette> */}
        </div>
      </div>
    );
  }
}

export default App;
