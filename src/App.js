import React, { Component } from 'react'
import { isEqual, omit } from 'lodash'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import perlin from './util/perlin'

import './App.css'


class App extends Component {
    constructor() {
        super()
        this.state = {
            seed: 9,
            size: 128,
            octaves: 6,
            layers: 3,
            tile: null
        }
    }
    calcTile = () => {
        const {size, seed, octaves, layers} = this.state
        const tile = perlin(size, size, seed, octaves, layers)
        this.setState({tile})
    }
    getBackgroundStyle = () => this.state.tile ? {background: `repeat url(${this.state.tile})`} : {}
    componentDidMount() {
        this.calcTile()
    }
    componentDidUpdate(prevProps, prevState) {
        if (!isEqual(omit(prevState, 'tile'), omit(this.state, 'tile'))) {
            this.calcTile()
        }
    }
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div className="App">
                    <header className="App-header">
                        <div className="App-title">
                            <TextField
                                value={this.state.seed}
                                type="number"
                                onChange={e => this.setState({seed: +e.target.value})}
                                floatingLabelText="Seed"/>

                            <TextField
                                value={this.state.octaves}
                                type="number"
                                min={1}
                                max={this.state.size}
                                onChange={e => this.setState({octaves: +e.target.value})}
                                floatingLabelText="Octaves"/>

                            <TextField
                                value={this.state.layers}
                                type="number"
                                min={1}
                                onChange={e => this.setState({layers: +e.target.value})}
                                floatingLabelText="Layers"/>

                        </div>
                        <RaisedButton
                            href={this.state.tile}
                            label="Download"
                            download="tile.png"></RaisedButton>
                    </header>
                    <div className="App-tile" style={this.getBackgroundStyle()}>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default App
